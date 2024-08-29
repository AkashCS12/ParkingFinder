#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "wifi_name"; //modify this
const char* password = "wifi_password"; //modify this
const char* serverAddress = "ip address"; //modify this 

const int trigPin = D6; 
const int echoPin = D5; 

void setup() {
    Serial.begin(115200);
    delay(10);

    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);

    WiFi.begin(ssid, password);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
}

void loop() {
    long duration, distance;

    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2;

    String occupancyStatus = (distance < 20) ? "occupied" : "unoccupied";

    updateDatabase(occupancyStatus);

    delay(500);
}

void updateDatabase(String status) {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;

        String url = "http://" + String(serverAddress) + "update_status.php?status=" + status;

        if (http.begin(client, url)) {
            int httpResponseCode = http.GET();
            if (httpResponseCode > 0) {
                String response = http.getString();
                Serial.println("Response: " + response);

            } else {
                Serial.print("Error on sending GET Request. Status code: ");
                Serial.println(httpResponseCode);
            }
            http.end();
        } else {
            Serial.println("Unable to connect to server");
        }
    } else {
        Serial.println("WiFi Disconnected");
        }
}