# DeliverUS - Project Requirements

## Introduction
DeliverUS is a made-up company whose business is focused on delivering food from 3rd parties (restaurants) to customers. To this end, we are requested to develop the needed software products which hopefully will boost the company. After interviewing the product owners and some stakeholders, the general objectives and requirements have been agreed, as described in this document.

Check https://github.com/IISSI2-IS/DeliverUS-Backend for full DeliverUS app requirements.

**Complete this project template of the frontend app for customers in order to fulfill customer related requirements.**

These tasks include:
### 2nd Deliverable:
#### FR1: Restaurants listing.
List restaurants and enable customers to navigate to restaurant details so they can create and place a new order

#### FR7: Show top 3 products.
Customers will be able to query top 3 products from all restaurants. Top products are the most popular ones, in other words the best sellers.

#### FR2: Restaurants details and menu.
Customers will be able to query restaurants details and the products offered by them.

#### FR5: Listing my confirmed orders.
A Customer will be able to check his/her confirmed orders, sorted from the most recent to the oldest.

#### FR6: Show order details.
A customer will be able to look his/her orders up. The system should provide all details of an order, including the ordered products and their prices.

### 3rd Deliverable:
#### FR3: Add, edit and remove products to a new order.
A customer can add several products, and several units of a product to a new order. Before confirming, customer can edit and remove products. Once the order is confirmed, it cannot be edited or removed.

Keep in mind **FR4: Confirm or dismiss new order.** You have to allow user to confirm or dismiss the order before sending it to the backend.


# Frontend deployment steps:
1. Accept the group project assignment of your github classroom if you have not done it before. Once you accepted it, you will have your own copy of this project template.
2. Clone your private repository at your local development environment by opening VScode and clone it by opening Command Palette (Ctrl+Shift+P or F1) and `Git clone` this repository, or using the terminal and running
```PowerShell
git clone <url>
```
It may be necessary to setup your github username by running the following commands on your terminal:
```PowerShell
git config --global user.name "FIRST_NAME LAST_NAME"
git config --global user.email "MY_NAME@example.com"
```
In case you are asked if you trust the author, please select yes.

3. Setup your environment file. As explained in labs, it is needed to create a copy of the `.env.example` file, name it `.env` and include your environment variables values, specially your API_BASE_URL (usually http://localhost:3000 to run the app in the web browser of the same computer).
   * If you want to connect from your mobile device to your backend, http://localhost:3000 will NOT work because the backend is not running on your mobile device. In order to run your frontend on your device follow these steps:
     * Check your backend server ip by running: `ipconfig` (or `ifconfig` for Linux and MacOS), in home networks it usually follows the 192.168.YYY.XXX pattern.
     * Update the `.env` `API_BASE_URL` property with your backend server ip and port, for instance: http://192.168.YYY.XXX:3000
     * Expo tools caches old `.env` properties' values, so you have to explicitly run the following commands to remove cached values:
       * stop frontend (Ctrl+C)
       * remove `.expo` folder in your project root folder
       * run `expo r -c`
     * NOTE: Everytime you make any modification on your `.env` (for instance, if your backend server IP changes) file you will need to run these steps again.

4. Install dependencies. Run `npm install` to download and install packages to the current project folder.

5. Check and run DeliverUS backend app as detailed in:
https://github.com/IISSI2-IS/DeliverUS-Backend#backend-deployment-steps

6. Run this project (Template of frontend for customers) by running `npm start`.

7. Metro bundler development tools should automatically open on your browser (usually at http://localhost:19002/). Once you are presented with the Metro Bundler development tools web interface, click on 'Run in web browser' or click on 'Run on Android device/emulator' or 'Run on iOS simulator' to open your web/android/ios version of the app respectively.
   * Alternatively, you can use the Expo app on your device to open this project app on your real device by scanning the QR code rendered at the bottom left of the metro bundler development tools web interface. Remember to modify `.env` and follow the steps to remove cached properties detailed in 3.
