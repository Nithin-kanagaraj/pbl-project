# --- STAGE 1: Build the project ---
# Use Maven to build the application
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the source code and build the JAR
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# --- STAGE 2: Run the application ---
# Use a lightweight JRE image for production
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy only the built JAR from the first stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
