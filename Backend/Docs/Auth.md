# Authentication

- [x] Signup:

  - **Endpoint --> http://localhost:5000/api/user-signup**

  - **Method --> POST**

  - Required Fields:

    - username
    - password
    - verifiedPasswprd

  - OnSuccess:

    - payload status: 201
    - payload json message

  - OnError:

    - onUser error:

      - payload status: 400
      - payload json message

    - onServer error:

      - payload status: 500
      - payload json message

- [x] SignIn:

  - **Endpoint --> http://localhost:5000/user-signin**

  - **Method --> POST**

  - Required Fields:

    - username
    - password

  - OnSucces:

    - payload status: 200
    - payload cookie set automatically

  - OnError:

    - onUser error:

      - payload status: 400 / 404
      - payload json message

    - onServer error:

      - payload status: 500
      - payload json message

- [x] isLoggedIn

  - **Endpoint --> http://localhost:5000/api/check-user-auth-status**

  - **Method --> GET**

  - OnUserLoggedIn:

    - payload status: 200
    - payload json: **{ auth_status: true, isSeller: isUserASeller }**

  - OnUserNotLoggedIn:

    - payload status: 200
    - payload json: **{ auth_status: false }**

  - onSever error:

    - payload status: 500
    - payload json message
