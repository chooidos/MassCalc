use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri_plugin_http::reqwest::header::{HeaderMap, HeaderValue};
use tauri_plugin_http::reqwest::Client;

#[derive(Serialize, Deserialize, Debug)]
pub struct Element {
    pub name: String,
    pub symbol: String,
    pub atomic_mass: f64,
}

#[derive(Serialize, Deserialize, Debug)]
struct ApiResponse {
    data: Vec<Element>,
}

fn get_json_path() -> PathBuf {
    std::env::current_dir()
        .expect("Cannot get current dir")
        .join("elements.json")
}

async fn fetch_elements_from_api() -> Result<Vec<Element>, String> {
    let url = "https://periodic-table-api.p.rapidapi.com/getAllElements";
    let client = Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .map_err(|e| e.to_string())?;

    let mut headers = HeaderMap::new();
    headers.insert("x-rapidapi-key", HeaderValue::from_static("YOUR_KEY_HERE"));
    headers.insert(
        "x-rapidapi-host",
        HeaderValue::from_static("periodic-table-api.p.rapidapi.com"),
    );

    let resp = client
        .get(url)
        .headers(headers)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        return Err(format!("Status {}", resp.status()));
    }

    let text = resp.text().await.map_err(|e| e.to_string())?;
    let api: ApiResponse = serde_json::from_str(&text).map_err(|e| e.to_string())?;

    Ok(api.data)
}

#[tauri::command]
pub async fn get_elements() -> Result<Vec<Element>, String> {
    let path = get_json_path();

    if !path.exists() {
        let elems = fetch_elements_from_api().await?;
        let data = serde_json::to_string_pretty(&elems).map_err(|e| e.to_string())?;
        fs::write(&path, data).map_err(|e| e.to_string())?;
        return Ok(elems);
    }

    let raw = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let elems: Vec<Element> = serde_json::from_str(&raw).map_err(|e| e.to_string())?;
    Ok(elems)
}
