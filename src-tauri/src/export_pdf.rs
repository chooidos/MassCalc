use chrono::Local;
use printpdf::{BuiltinFont, Mm, PdfDocument};
use rfd::FileDialog;
use serde::{Deserialize, Serialize};
use std::{fs::File, io::BufWriter};

#[derive(Debug, Serialize, Deserialize)]
pub struct CalculationResultItem {
    pub element: String,
    pub mass: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CalculationOutput {
    pub elements: Vec<CalculationResultItem>,
    pub molar_mass: f64,
    pub c_p: f64,
}

#[tauri::command]
pub fn export_to_pdf(output: CalculationOutput) -> Result<(), String> {
    let save_path = FileDialog::new()
        .set_title("Save PDF Report")
        .add_filter("PDF Document", &["pdf"])
        .set_file_name("report.pdf")
        .save_file();
    let path = match save_path {
        Some(p) => p,
        None => return Err("Користувач відмінив збереження".into()),
    };

    let (doc, page1, layer1) =
        PdfDocument::new("Calculation Report", Mm(210.0), Mm(297.0), "Layer 1");
    let mut layer = doc.get_page(page1).get_layer(layer1);

    let font = doc
        .add_builtin_font(BuiltinFont::Helvetica)
        .map_err(|e| e.to_string())?;

    let now = Local::now().format("%Y-%m-%d %H:%M").to_string();
    layer.use_text("Calculation Report", 18.0, Mm(70.0), Mm(280.0), &font);
    layer.use_text(format!("Date: {}", now), 12.0, Mm(20.0), Mm(270.0), &font);

    let mut y = Mm(250.0);
    layer.use_text(
        "Element       |       Mass (calculated)       |       Mass (weighted)",
        14.0,
        Mm(20.0),
        y,
        &font,
    );
    y -= Mm(8.0);
    layer.use_text(
        "---------------------------------------------------------------------",
        12.0,
        Mm(20.0),
        y,
        &font,
    );
    y -= Mm(8.0);

    for item in &output.elements {
        if y.0 < 20.0 {
            let (new_page, new_layer) = doc.add_page(Mm(210.0), Mm(297.0), "Layer 1");
            layer = doc.get_page(new_page).get_layer(new_layer);
            y = Mm(280.0);
        }
        let line = format!("{:<15} {:>10.5}", item.element, item.mass);
        layer.use_text(line, 12.0, Mm(20.0), y, &font);
        y -= Mm(8.0);
    }

    y -= Mm(10.0);
    layer.use_text(
        format!("Molar mass: {:.5} g/mol", output.molar_mass),
        12.0,
        Mm(20.0),
        y,
        &font,
    );
    y -= Mm(8.0);
    layer.use_text(
        format!("Cp: {:.5} J/g·K", output.c_p),
        12.0,
        Mm(20.0),
        y,
        &font,
    );

    let file = File::create(&path).map_err(|e| e.to_string())?;
    doc.save(&mut BufWriter::new(file))
        .map_err(|e| e.to_string())?;

    Ok(())
}
