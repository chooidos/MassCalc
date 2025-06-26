// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use reqwest::header::{HeaderMap, HeaderValue};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::command;
use tauri::{LogicalSize, Manager, Size, WindowEvent};
use tauri_plugin_http::reqwest;

mod export_pdf;

#[derive(Serialize, Deserialize, Debug)]
struct ApiResponse {
    data: Vec<Element>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Element {
    name: String,
    symbol: String,
    atomic_mass: f64,
}

#[derive(Deserialize)]
struct RawElement {
    symbol: String,
    atomic_mass: serde_json::Value,
    number: serde_json::Value,
}

#[derive(Deserialize)]
struct CalculationInput {
    elements: Vec<RawElement>,
    sample_weight: serde_json::Value,
}

#[derive(Debug, Serialize)]
struct CalculationResultItem {
    element: String,
    mass: f64,
}

#[derive(Debug, Serialize)]
struct CalculationOutput {
    elements: Vec<CalculationResultItem>,
    molar_mass: f64,
    c_p: f64,
}

fn get_json_path() -> PathBuf {
    let base_path = std::env::current_dir().expect("Cannot get current dir");
    base_path.join("elements.json")
}

async fn fetch_elements_from_api() -> Result<Vec<Element>, String> {
    let url = "https://periodic-table-api.p.rapidapi.com/getAllElements";

    let client = Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .map_err(|e| format!("Clent create error: {}", e))?;

    let mut headers = HeaderMap::new();
    headers.insert(
        "x-rapidapi-key",
        HeaderValue::from_static("f402b45c49msh60e767cbb413625p1d5f11jsn59599dff491d"),
    );
    headers.insert(
        "x-rapidapi-host",
        HeaderValue::from_static("periodic-table-api.p.rapidapi.com"),
    );

    let response = client
        .get(url)
        .headers(headers)
        .send()
        .await
        .map_err(|e| format!("Response error: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Response status {}", response.status()));
    }

    let text = response
        .text()
        .await
        .map_err(|e| format!("Error getting text {}", e))?;

    let api_response: ApiResponse = serde_json::from_str(&text)
        .map_err(|e| format!("Error in JSON: {}. Server response: {}", e, text))?;

    Ok(api_response.data)
}

#[command]
async fn get_elements() -> Result<Vec<Element>, String> {
    let path = get_json_path();

    if !path.exists() {
        match fetch_elements_from_api().await {
            Ok(elements) => {
                let json_data =
                    serde_json::to_string_pretty(&elements).map_err(|e| e.to_string())?;
                fs::write(&path, json_data).map_err(|e| e.to_string())?;
                return Ok(elements);
            }
            Err(err) => {
                return Err(err);
            }
        }
    }

    let data = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let elements: Vec<Element> = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok(elements)
}

fn parse_f64(value: &serde_json::Value) -> f64 {
    if let Some(n) = value.as_f64() {
        n
    } else if let Some(s) = value.as_str() {
        s.parse::<f64>().unwrap_or(0.0)
    } else {
        0.0
    }
}

fn round5(value: f64) -> f64 {
    (value * 100000.0).round() / 100000.0
}

#[command]
fn calculate(input: CalculationInput) -> CalculationOutput {
    let sample_weight = parse_f64(&input.sample_weight);

    let elements: Vec<(String, f64, f64)> = input
        .elements
        .iter()
        .map(|el| {
            let atomic_mass = parse_f64(&el.atomic_mass);
            let number = parse_f64(&el.number);
            (el.symbol.clone(), atomic_mass, number)
        })
        .collect();

    let molar_mass: f64 = elements
        .iter()
        .map(|(_, atomic_mass, number)| atomic_mass * *number as f64)
        .sum();

    let total_atoms: f64 = elements.iter().map(|(_, _, n)| *n).sum();
    let c_p: f64 = total_atoms * 3.0 * 8.314 / molar_mass;

    if molar_mass == 0.0 || sample_weight == 0.0 {
        return CalculationOutput {
            elements: vec![],
            molar_mass: 0.0,
            c_p: 0.0,
        };
    }

    let results = elements
        .iter()
        .map(|(symbol, atomic_mass, number)| CalculationResultItem {
            element: symbol.clone(),
            mass: round5((atomic_mass * *number as f64 / molar_mass) * sample_weight),
        })
        .collect();

    CalculationOutput {
        elements: results,
        c_p: round5(c_p),
        molar_mass: round5(molar_mass),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_elements,
            calculate,
            export_pdf::export_to_pdf,
        ])
        .setup(|app| {
            // Use the Manager trait to access the window by its label
            if let Some(window) = app.get_webview_window("main") {
                // Prevent resizing when moving between monitors with different DPI settings
                let window_ = window.clone();
                window_.on_window_event(move |event| {
                    if let WindowEvent::ScaleFactorChanged { .. } = event {
                        window
                            .set_size(Size::Logical(LogicalSize {
                                width: 800.0,
                                height: 600.0,
                            }))
                            .unwrap();
                    }
                });
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
