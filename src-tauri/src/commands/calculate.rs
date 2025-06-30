use serde::Deserialize;
use serde::Serialize;

#[derive(Deserialize)]
pub struct RawElement {
    pub symbol: String,
    pub atomic_mass: serde_json::Value,
    pub number: serde_json::Value,
}

#[derive(Deserialize)]
pub struct CalculationInput {
    pub elements: Vec<RawElement>,
    pub sample_weight: serde_json::Value,
}

#[derive(Serialize)]
pub struct CalculationResultItem {
    pub element: String,
    pub mass: f64,
}

#[derive(Serialize)]
pub struct CalculationOutput {
    pub elements: Vec<CalculationResultItem>,
    pub molar_mass: f64,
    pub c_p: f64,
}

fn parse_f64(value: &serde_json::Value) -> f64 {
    if let Some(n) = value.as_f64() {
        n
    } else if let Some(s) = value.as_str() {
        s.parse().unwrap_or(0.0)
    } else {
        0.0
    }
}

fn round5(v: f64) -> f64 {
    (v * 100000.0).round() / 100000.0
}

#[tauri::command]
pub fn calculate(input: CalculationInput) -> CalculationOutput {
    let sample_weight = parse_f64(&input.sample_weight);

    let elems: Vec<(String, f64, f64)> = input
        .elements
        .iter()
        .map(|el| {
            let atomic_mass = parse_f64(&el.atomic_mass);
            let number = parse_f64(&el.number);
            (el.symbol.clone(), atomic_mass, number)
        })
        .collect();

    let molar_mass: f64 = elems.iter().map(|(_, m, n)| m * *n).sum();

    let total_atoms: f64 = elems.iter().map(|(_, _, n)| *n).sum();
    let c_p = if molar_mass > 0.0 {
        total_atoms * 3.0 * 8.314 / molar_mass
    } else {
        0.0
    };

    let results = if molar_mass > 0.0 && sample_weight > 0.0 {
        elems
            .into_iter()
            .map(|(sym, am, n)| CalculationResultItem {
                element: sym,
                mass: round5((am * n / molar_mass) * sample_weight),
            })
            .collect()
    } else {
        Vec::new()
    };

    CalculationOutput {
        elements: results,
        molar_mass: round5(molar_mass),
        c_p: round5(c_p),
    }
}
