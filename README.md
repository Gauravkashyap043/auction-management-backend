# Backend API for Auction Management App

This is the backend API for the Auction Management App, built using Node.js. Below is the description of the API endpoints and how to run the backend server.

## Environment Variables

Create a `.env` file in the root of the backend project and add the following environment variables:

```plaintext
DB_URL=mongodb+srv://your-username:your-password@your-mongodb-cluster-url/
BACK_PORT=4000
JWT_SECRET_TOKEN=auction_management
```

Replace `your-username`, `your-password`, and `your-mongodb-cluster-url` with your actual MongoDB database credentials and connection URL.

## Running the Backend

To run the backend server, use the following command:

```bash
npm run dev
```

This will start the backend server on port 4000 (or the port specified in the `BACK_PORT` environment variable).

## API Endpoints

### Create Auction

This endpoint allows authenticated users to create a new auction listing.

```http
POST /api/auctions/create-auction
```

Parameters:
- `productImage`: The image of the item being auctioned (multipart/form-data)
- `title`: The title of the item.
- `description`: A brief description of the item.
- `startPrice`: The starting bid price for the auction.
- `auctionDuration`: The duration of the auction in minutes.

Example:

```javascript
auctionRouter.post("/create-auction", upload.single("productImage"), createAuction);
```

### Place Bid

This endpoint allows authenticated users to place bids on ongoing auctions.

```http
POST /auctions/auction/place-bid/:id
```

Parameters:
- `id`: The ID of the auction to place a bid on.
- `bidAmount`: The amount of the bid.

Example:

```javascript
auctionRouter.post("/auction/place-bid/:id", placeBid);
```

### Get All Auctions

This endpoint retrieves data for all ongoing auctions.

```http
GET /auctions/auctions
```

Example:

```javascript
auctionRouter.get("/auctions", getAllAuctions);
```

### Get Single Auction by ID

This endpoint retrieves data for a single auction by its ID.

```http
GET /auctions/auctions/:auctionId
```

Parameters:
- `auctionId`: The ID of the auction to retrieve data for.

Example:

```javascript
auctionRouter.get("/auctions/:auctionId", getSingleAuction);
```

### Get All Auctions by Register ID

This endpoint retrieves data for all auctions created by a specific user (registered user) based on their ID.

```http
GET /api/auctions/auctions/register/:registerId
```

Parameters:
- `registerId`: The ID of the registered user.

Example:

```javascript
auctionRouter.get("/auctions/register/:registerId", getAllAuctionsByRegisterId);
```

That's all for the backend API of the Auction Management App. It provides the necessary endpoints to create auctions, place bids, and retrieve auction data based on different criteria. Happy bidding!
