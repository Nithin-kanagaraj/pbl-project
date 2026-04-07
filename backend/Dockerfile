# Use Eclipse Temurin for a reliable Java 17 base image
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the generated JAR file from the target directory
COPY target/*.jar app.jar

# Expose the port (standard Spring Boot is 8080)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
