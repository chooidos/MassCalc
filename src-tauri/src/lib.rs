// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{LogicalSize, Manager, Size, WindowEvent};

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        // .invoke_handler(tauri::generate_handler![greet])
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
