<p align="center">
  <img src = "https://imgur.com/0Zrgwj0.png" width=700>
</p>
<h1 align="center"> JS Demons Payments Portal </h1>

JS Demons Payments Portal is a sleek and modern international payment system designed for banks. Customers can securely log in, register, and make international payments using the SWIFT method. This system ensures data security and integrity with robust encryption and validation.

## Members
- **Malik Mannan** - ST10091422  
- **Thato Sebelemetja** – ST10067544

## Features
- **User Registration & Login:** Secure authentication system with username and password.
- **International Payment Options:** SWIFT-based international payments with support for various currencies.
- **Responsive Design:** Sleek and professional UI built using React and Material UI.
- **Real-Time Payment Process:** Integrated real-time payment system that stores payment data securely.
- **Disabled Payment Methods:** Other payment methods (Mastercard, PayPal, EFT) are visually disabled, leaving SWIFT as the primary method.
  

## Screenshots

### Home Page

<p align="center">
  <img src = "https://imgur.com/r5SPBCg.png" width=700>
</p>

### Payment Information/Method Page

<p align="center">
  <img src = "https://imgur.com/aum2Nuy.png" width=700>
</p>

### Payment Details

<p align="center">
  <img src = "https://imgur.com/Z397Nlg.png" width=700>
</p>


## Tech Stack

- **Frontend**: React.js, Material UI
- **Backend**: Node.js, Express
- **Validation**: Regex-based form validation
- **Security**: bcrypt for password hashing, JWT for authentication

## Project Structure
```bash
├── globalPaymentsPlatform
│   ├── backend               # Node.js/Express backend
│   │   ├── db                
│   │   ├── keys              # Private and public keys for the SSL Certificates
│   │   ├── middleWare
│   │   ├── models            # Data models (for storing users, payments)
│   │   └── routes            # API routes (login, register, payment)
│   └── frontend              # Node.js frontend
│       ├── public            # Public assets like index.html
│       └── src               # React components and assets
└── README.md                 # Project documentation
```

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or above)
- npm (comes with Node.js)
- [Git](https://git-scm.com/)


## Installation

Follow these steps to get the app up and running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/IIEWFL/apds7311-part-2-js-demons.git
cd globalPaymentsPlatform
```

### 2. Frontend Setup (React)

Navigate to the frontend folder and install the dependencies:

```bash
cd globalPaymentsPlatform/frontend
npm install
```

### 3. Backend Setup (Node.js/Express)

Navigate to the backend folder and install the dependencies:

```bash
cd ../backend
npm install
```

### 5. Running the App

Follow these steps below to get the app up and running or watch the video here:

https://drive.google.com/drive/folders/1jDQK7Gx0coSoVBcpDMRGbLRVPnSbSX6U?usp=sharing

#### Start the Frontend (React)
In the globalPaymentsPlatform directory, start the frontend:

```bash
cd globalPaymentsPlatform/frontend
npm start
```

The React app will now run at http://localhost:3000/.

#### Start the Backend (Node.js/Express)
In the globalPaymentsPlatform directory, start the backend:

```bash
cd ../backend
npm start
```

The backend API will run at http://localhost:5000/.

## Usage
Once the app is up and running:
1. Open your browser and navigate to http://localhost:3000/.
2. Register a new account using your full name, username, ID number, and account number.
3. Login using your credentials.
4. Proceed to Payment and fill in the required fields, choose your currency, and select the SWIFT payment method.
5. Review the transaction on the Payment Details page and confirm the payment.

## CIRCLECI AND SONQUBE TESTS 

### Repo Used to Run CircleCI & SonarQube Tests
https://github.com/st10091422/APDS7311-PART2.git

We used a different repo due to issues with the Github Classroom Repo visibility settings.

### CirclCI Test Screenshots



### Sonarqube (sonarcloud) Test Screenshots



