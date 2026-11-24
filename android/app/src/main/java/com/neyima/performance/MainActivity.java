package com.neyima.performance;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int BRAND_BURGUNDY = Color.parseColor("#3C0016");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        View contentView = findViewById(android.R.id.content);
        if (contentView == null) {
            return;
        }

        // Fondo burdeos detrás de la barra de notificaciones y barra de gestos (Android 15/16 Edge-to-Edge)
        contentView.setBackgroundColor(BRAND_BURGUNDY);

        // Íconos claros sobre fondo burdeos en barra de estado y navegación
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        if (controller != null) {
            controller.setAppearanceLightStatusBars(false);
            controller.setAppearanceLightNavigationBars(false);
        }

        // Respetar siempre la barra de notificaciones, cámara (cutout), barra inferior y teclado (IME)
        ViewCompat.setOnApplyWindowInsetsListener(contentView, (view, windowInsets) -> {
            Insets insets = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars()
                    | WindowInsetsCompat.Type.displayCutout()
                    | WindowInsetsCompat.Type.ime()
            );
            view.setPadding(insets.left, insets.top, insets.right, insets.bottom);
            return WindowInsetsCompat.CONSUMED;
        });

        ViewCompat.requestApplyInsets(contentView);
    }
}
