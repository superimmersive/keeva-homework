package za.co.superimmersive.keevahomework;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Draw under the status bar so the pink header and CSS safe-area padding line up.
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
