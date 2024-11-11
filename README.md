<p align="center">
  <img src = "https://imgur.com/0Zrgwj0.png" width=700>
</p>
<h1 align="center"> JS Demons Payments Portal </h1>

**A sleek and modern international payment system designed for banks.**

JS Demons Payments Portal empowers customers to securely log in, register, and make international payments using the SWIFT method. This system prioritizes data security and integrity with robust encryption and validation.

## 👥 Team

* **Malik Mannan** - ST10091422
* **Thato Sebelemetja** - ST10067544

## ✨ Features

* **Secure Authentication:** User registration and login with robust password hashing.
* **International Payments:** SWIFT-based payments with support for various currencies.
* **Responsive UI:** Sleek and professional design built with React and Material UI.
* **Real-time Processing:** Integrated system for secure payment data storage.
* **Employee Dashboard:**  Admin panel for payment verification and management.

**Note:** Other payment methods (Mastercard, PayPal, EFT) are currently unavailable, with SWIFT as the primary method.

## 📸 Screenshots

| Feature | Screenshot |
|---|---|
| Home Page | ![Home Page](https://imgur.com/DP0CPgh.png) |
| Login Page | ![Login Page](https://imgur.com/gtKsIJ3.png) |
| Customer Dashboard | ![Customer Dashboard](https://imgur.com/cA3np5S.png) |
| Payment Information | ![Payment Information](https://imgur.com/8i3yfYI.png) |
| Payment Details | ![Payment Details](https://imgur.com/CSpvw0F.png) |
| Employee Dashboard | ![Employee Dashboard](https://imgur.com/rh6GvYV.png) |

## 🤔 How It Works

Once the app is up and running, access it at http://localhost:3000/. Login using the preconfigured credentials provided in the [test.http](https://github.com/ST10067544-Thato/JS-Demons-Payment-Portal/blob/main/globalPaymentsPlatform/backend/test.http) file.

### Customer Workflow

* **Dashboard:** View and manage your payments.
* **Add Payment:** Enter payment details, including amount, currency, and SWIFT information.
* **Payment Confirmation:** Review and confirm your payment.

### Employee Workflow

* **Dashboard:** View all payments made by users.
* **Verify Payments:** Confirm legitimate payments and mark them as "verified."
* **Revert Payments:** Revert payments to "pending" status if needed.

## 🚀 Quick Start

1. **Clone the Repository:**

```bash
git clone https://github.com/IIEWFL/apds7311-part-2-js-demons.git
cd globalPaymentsPlatform
```

2. **Install Dependencies:**

Navigate to the frontend folder and install the dependencies:

```bash
cd frontend && npm install
cd ../backend && npm install
```

3. **Run the App:**
   
   You can follow the steps below or watch the video tutorial [here:](https://drive.google.com/drive/folders/1jDQK7Gx0coSoVBcpDMRGbLRVPnSbSX6U?usp=sharing)
   
   * **Frontend:**  
    ```bash
     cd globalPaymentsPlatform/frontend
     npm start
     ```
     The React app will now run at http://localhost:3000/.  
   * **Backend:**  
    ```bash
     cd ../backend
     npm run dev
     ```
     The backend API will run at http://localhost:5000/.  

## 💻 Tech Stack

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Material UI](https://img.shields.io/badge/Material%20UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA9B0?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

* **Validation:** Regex
* **Security:** bcrypt, JWT, Nodemon (for development)

## 📂 Project Structure
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

## 🧪 Testing

### Continuous Integration and Code Quality

This project utilizes CircleCI for continuous integration and SonarQube (SonarCloud) for code quality analysis.

[![CircleCI](https://circleci.com/gh/ST10067544-Thato/JS-Demons-Payment-Portal.svg?style=svg)](https://circleci.com/gh/ST10067544-Thato/JS-Demons-Payment-Portal)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ST10067544-Thato_JS-Demons-Payment-Portal&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ST10067544-Thato_JS-Demons-Payment-Portal)

* **CircleCI:** Automates the build, test, and deployment process. View the CircleCI pipelines for this project [here](https://app.circleci.com/pipelines/github/ST10067544-Thato/JS-Demons-Payment-Portal)
* **SonarQube:** Provides static code analysis to identify bugs, vulnerabilities, and code smells. View the SonarQube report for this project [here](https://sonarcloud.io/project/overview?id=ST10067544-Thato_JS-Demons-Payment-Portal)

**Note:** A separate repo ([https://github.com/ST10067544-Thato/JS-Demons-Payment-Portal](https://github.com/ST10067544-Thato/JS-Demons-Payment-Portal.git)) was used for testing due to GitHub Classroom visibility settings.
