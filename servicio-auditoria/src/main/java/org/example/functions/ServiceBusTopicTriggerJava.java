package org.example.functions;

import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import java.util.UUID;

public class ServiceBusTopicTriggerJava {

    @FunctionName("AuditorCamasDisponibles")
    public void auditarCamas(
            @ServiceBusTopicTrigger(
                    name = "mensajeCama",
                    topicName = "camas-disponibles-topic",
                    subscriptionName = "audit-sub",
                    connection = "ServiceBusConnection"
            ) String mensajeCama,
            @CosmosDBOutput(
                    name = "registroCamas",
                    databaseName = "ZacamilDB",
                    containerName = "Camas",
                    connection = "CosmosDBConnection",
                    createIfNotExists = true,
                    partitionKey = "/numeroCama" // <--- AQUÍ LE DECIMOS EXACTAMENTE CÁL ES LA LLAVE
            ) OutputBinding<String> registroCamas,
            final ExecutionContext context
    ) {
        context.getLogger().info("========== INICIO DE AUDITORÍA (CAMAS) ==========");
        context.getLogger().info("1. Mensaje crudo recibido del Service Bus: " + mensajeCama);

        String idUnico = UUID.randomUUID().toString();

        // Armamos el JSON y lo guardamos en una variable para poder loguearlo
        String documentoJson = "{" +
                "\"id\": \"" + idUnico + "\"," +
                "\"numeroCama\": \"15\"," +
                "\"tipoEvento\": \"Cama Disponible\"," +
                "\"datosOriginales\": " + mensajeCama +
                "}";

        context.getLogger().info("2. JSON exacto que se va a enviar a Cosmos DB: " + documentoJson);

        try {
            registroCamas.setValue(documentoJson);
            context.getLogger().info("3. ¡Guardado exitoso en base de datos Cosmos DB!");
        } catch (Exception e) {
            context.getLogger().severe("X ERROR CRÍTICO AL GUARDAR EN COSMOS DB: " + e.getMessage());
        }

        context.getLogger().info("========== FIN DE AUDITORÍA ==========");
    }

    @FunctionName("AuditorAltasMedicas")
    public void auditarAltas(
            @ServiceBusTopicTrigger(
                    name = "mensajeAlta",
                    topicName = "altas-topic",
                    subscriptionName = "audit-sub",
                    connection = "ServiceBusConnection"
            ) String mensajeAlta,
            @CosmosDBOutput(
                    name = "registroAltas",
                    databaseName = "ZacamilDB",
                    containerName = "AuditoriaLogs",
                    connection = "CosmosDBConnection",
                    createIfNotExists = true,
                    partitionKey = "/numeroCama"
            ) OutputBinding<String> registroAltas,
            final ExecutionContext context
    ) {
        context.getLogger().info("========== INICIO DE AUDITORÍA (ALTAS) ==========");
        context.getLogger().info("1. Mensaje crudo recibido del Service Bus: " + mensajeAlta);

        String idUnico = UUID.randomUUID().toString();

        String documentoJson = "{" +
                "\"id\": \"" + idUnico + "\"," +
                "\"numeroCama\": \"15\"," +
                "\"tipoEvento\": \"Alta Medica\"," +
                "\"datosOriginales\": " + mensajeAlta +
                "}";

        context.getLogger().info("2. JSON exacto que se va a enviar a Cosmos DB: " + documentoJson);

        try {
            registroAltas.setValue(documentoJson);
            context.getLogger().info("3. ¡Guardado exitoso en base de datos Cosmos DB!");
        } catch (Exception e) {
            context.getLogger().severe("X ERROR CRÍTICO AL GUARDAR EN COSMOS DB: " + e.getMessage());
        }

        context.getLogger().info("========== FIN DE AUDITORÍA ==========");
    }
}