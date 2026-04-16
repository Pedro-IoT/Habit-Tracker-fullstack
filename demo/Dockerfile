FROM maven:3.9.11-eclipse-temurin-25 AS builder
WORKDIR /workspace

COPY pom.xml ./pom.xml
COPY Backend/pom.xml Backend/pom.xml
COPY FrontEnd/pom.xml FrontEnd/pom.xml
COPY Backend/src Backend/src
COPY FrontEnd FrontEnd

RUN mvn -B -DskipTests package

FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=builder /workspace/Backend/target/Backend-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

