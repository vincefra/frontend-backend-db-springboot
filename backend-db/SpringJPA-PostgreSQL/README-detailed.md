# Infographics - Backend / Databas

  - Java SpringBoot
  - PostgresSQL
  - Maven
  - JDK 8

Se till att installera följande:

| Namn | Länk | Beskrivning |
| ------ | ------ | ------ |
| Docker | https://www.docker.com | Installera både Docker och Kitematic
| JDK8 | https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html | 
| Brew | https://brew.sh/ | Underlättar för att installera package

Backend, frontend och databasen delar samma repo just nu. Det går att köra allt lokalt eller kombinera med docker. Anledning till docker är för att det underlättar att sätta upp utan att behöva installera eller konfigurera.

### Bra länkar

Här är viktiga länkar att hålla koll på!

* [Backend](http://localhost:7878) - Länk till backend lokalt för att testa anrop
* [Swagger-ui-local](http://localhost:7878/swagger-ui.html) - Swagger-ui för att testa anrop lokalt
* [Swagger-ui-aws](http://ec2-3-123-154-0.eu-central-1.compute.amazonaws.com/swagger-ui.html) - Swagger-ui för att testa anrop på aws
* [AWS](http://ec2-3-123-154-0.eu-central-1.compute.amazonaws.com) - Här ligger projektet i Prod på aws

### Konfiguration

Öppna upp följande fil, application.yaml som ligger i resources. Följande profil är aktiv, develop.

```sh
active: develop
```

Det finns följande profiler som har olika inställningar.

```sh
develop
localdocker
local-dockerdb
develop
```

Profilen **develop** är standard och där finns val för att ha igång **flyway** eller inte. Skäl till att stänga av flyway ibland är för att kunna redigera databasen utan att **flyway** får problem för mismatch. 

Det är viktigt att varje ändring sparas i en ny scriptfil som ligger under **db -> migration**. När backend körs i en docker-container kommer istället localdocker att köras som profil. 

Det går att byta i dockerfile, -Dspring.profiles.active=**localdocker**

### Utveckling

Om du märker att programmet inte ändras trots att du har ändrat i koden, testa att **clean & build**. 

Här kommer en karta på projektet och kort beskrivning om varje fil.

**/configuration:**

| Namn  | Beskrivning |
| ------ | ------ |
| SimpleCORSFilter | Konfiguera hur CORS ska fungera
| Swagger2UiConfiguration | Behövs för Swagger

**/controller:**

| Namn  | Beskrivning |
| ------ | ------ |
| CustomerController | Alla länkar för customer, REST
| EmployeeController | Alla länkar för employee, REST
| ProjectController | Alla länkar för project, REST

**/model**
Här finns alla modeller som är strukturerad efter databasen, eftersom vi kör hibernate behövs de flesta klasser för relationer.

**/repo:**

| Namn  | Beskrivning |
| ------ | ------ |
| CustomerRepository | Tar in Sort, används för sortera ASC/DESC
| EmployeeRepository | Tar in Sort, används för sortera ASC/DESC
| ProjectRepository | Tar in Sort, används för sortera ASC/DESC

**/service:**
Här sker det mesta utav logiken, en del kod som hashmap kan skrivas om till snyggare lösning.

| Namn  | Beskrivning |
| ------ | ------ |
| CustomerService | Alla metoder, logik för Customer/Client
| EmployeeService | Alla metoder, logik för Employee
| ProjectService | Alla metoder, logik för Project
| ICustomerService | Interface, för alla metoder till Service
| IEmployeeService | Interface, för alla metoder till Service
| IProjectService | Interface, för alla metoder till Service

### Deploy frontend för att dela tomcat-server
Bygg frontend till prod genom följande kommando,
```sh
npm run build
```

Gå till build-mappen och kopiera innehållet till resources/static i backend. Clean & Build och dra sedan igång backend!


