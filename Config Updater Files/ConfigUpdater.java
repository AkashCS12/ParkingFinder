import java.io.*;
import java.util.Scanner;

public class ConfigUpdater {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Database Setup
        System.out.println("\n===============================");
        System.out.println("       DATABASE SETUP");
        System.out.println("===============================");

        System.out.print("Enter Database Servername [e.g localhost]: ");
        String dbServername = scanner.nextLine();

        System.out.print("Enter Database Username [e.g root]: ");
        String dbUsername = scanner.nextLine();

        System.out.print("Enter Database Password [Could be empty]: ");
        String dbPassword = scanner.nextLine();

        System.out.print("Enter Database Name [e.g parkingfinder]: ");
        String dbName = scanner.nextLine();

        // Mailer Setup
        System.out.println("\n===============================");
        System.out.println("         MAILER SETUP");
        System.out.println("===============================");

        System.out.print("Enter Mail Username [Email to Use]: ");
        String mailUsername = scanner.nextLine();

        System.out.print("Enter Mail Password [Generated App Password]: ");
        String mailPassword = scanner.nextLine();

        System.out.print("Enter Mail Host [Get Client Contact Info on This Email]: ");
        String mailHost = scanner.nextLine();

        // Mapbox Setup
        System.out.println("\n===============================");
        System.out.println("         MAPBOX SETUP");
        System.out.println("===============================");

        System.out.print("Enter Mapbox API token: ");
        String mapboxToken = scanner.nextLine();

        // Write to config.cfg
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("config.cfg"))) {
            writer.write("[DATABASE]");
            writer.newLine();
            writer.write("servername = " + dbServername);
            writer.newLine();
            writer.write("username = " + dbUsername);
            writer.newLine();
            writer.write("password = " + dbPassword);
            writer.newLine();
            writer.write("dbname = " + dbName);
            writer.newLine();
            writer.newLine();
            writer.write("[MAIL]");
            writer.newLine();
            writer.write("username = " + mailUsername);
            writer.newLine();
            writer.write("password = " + mailPassword);
            writer.newLine();
            writer.write("setfrom = " + mailUsername);
            writer.newLine();
            writer.write("host = " + mailHost);
            writer.newLine();
        } catch (IOException e) {
            System.out.println("Error writing to config.cfg: " + e.getMessage());
        }

        // Write to config.js
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("config.js"))) {
            writer.write("const CONFIG = {");
            writer.newLine();
            writer.write("    MAPBOX_TOKEN: '" + mapboxToken + "'");
            writer.newLine();
            writer.write("};");
            writer.newLine();
        } catch (IOException e) {
            System.out.println("Error writing to config.js: " + e.getMessage());
        }

        System.out.println("Configuration files updated successfully.");
    }
}
