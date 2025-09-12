# KRIYA - HRIS BACKEND

## About
This is the backend component of the  employee management system componenet of the revamp version of the Kriya HR.

## Functionalities

| # | Functionality                                           | Description                                                                 | Subsystem Component(s)           |
|---|----------------------------------------------------------|-----------------------------------------------------------------------------|----------------------------------|
| 1 | Add & manage employee data                              | Create, update, and store employee records in the system                    | DB, HRIS                         |
| 2 | Delegate access control                                  | Allow users to grant access to others using discretionary access control   | DB, HRIS                         |
| 3 | Push employee data to Suitelifer                        | Sync and send employee data to Fullsuite’s Suitelifer web-application      | Suitelifer, DB                   |
| 4 | Source of truth for Suitelifer and ATS                  | Act as the central, authoritative data provider for external applications  | DB, Suitelifer, ATS              |
| 5 | Receive new employee data from ATS                      | Accept and integrate incoming employee data from the ATS                   | ATS, DB                          |


### Notes
1) In login, the system generates a token containing the user_id and user_email of the client
    - The **user_id** is renamed as ***system_user_id*** for distinction
    - The **user_email** is renamed as **system_user_email** for distinction
    - The **company_id** is renamed as **system_company_id** for distinction
2) Every request contains a token containing the info about the client


### Deployments
1) Create a deployment branch for backend that payroll connects to. 