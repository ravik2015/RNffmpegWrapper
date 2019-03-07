package com.rnffmpeg;

import android.widget.Toast;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.github.hiteshsondhi88.libffmpeg.ExecuteBinaryResponseHandler;
import com.github.hiteshsondhi88.libffmpeg.FFmpeg;
import com.github.hiteshsondhi88.libffmpeg.LoadBinaryResponseHandler;
import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegCommandAlreadyRunningException;
import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegNotSupportedException;

import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.util.HashMap;

public class ToastModule extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    FFmpeg ffmpeg;

    public ToastModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ToastExample";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    // @ReactMethod
    // public void initialize(String message, int duration) {
    // Toast.makeText(getReactApplicationContext(), message, duration).show();
    // }

    @ReactMethod
    public void initialize() {
        ffmpeg = FFmpeg.getInstance(getReactApplicationContext());
        try {
            ffmpeg.loadBinary(new LoadBinaryResponseHandler() {
                @Override
                public void onSuccess() {
                    // FFmpeg is supported by device
                    Toast.makeText(getReactApplicationContext(), "Successfully Initialized", Toast.LENGTH_SHORT).show();
                }
            });
        } catch (FFmpegNotSupportedException e) {
            // Handle if FFmpeg is not supported by device
            Toast.makeText(getReactApplicationContext(), "Device not Supported.", Toast.LENGTH_SHORT).show();
        }
    }

    @ReactMethod
    public void executeCmd(final String command, final Callback errorCallback, final Callback successCallback) {
        try {
            String[] cmd = command.split(" ");
            if (command.length() != 0) {
                ffmpeg.execute(cmd, new ExecuteBinaryResponseHandler() {

                    @Override
                    public void onSuccess(String s) {
                        // FFmpeg command successfully executed
                        // desc.setText(s);
                        // Toast.makeText(getReactApplicationContext(), "success ffmpeg" + s, Toast.LENGTH_SHORT).show();
                        successCallback.invoke(s);

                    }

                    @Override
                    public void onFailure(String s) {
                        // FFmpeg command fail to execute
                        // desc.setText(s);
                        // Toast.makeText(getReactApplicationContext(), "failure ffmpeg" + s, Toast.LENGTH_SHORT).show();
                        errorCallback.invoke(s);

                    }

                });
            }
        } catch (FFmpegCommandAlreadyRunningException e) {
            // There is a command already running
            Toast.makeText(getReactApplicationContext(), e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

}