let rentals, reviews;

export default class RentalsDAO {
  static async injectDB(conn) {
    if (rentals) {
      return;
    }
    try {
      rentals = await conn.db(process.env.RESTREVIEWS_NS).collection("listingsAndReviews");
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
    } catch (e) {
      console.error(`Unable to establish a collection handle in rentalsDEO: ${e}`);
    }
  }

  static async getRentals({ filters = null, page = 0, rentalsPerPage = 20 } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      } else if ("beds" in filters) {
        query = { beds: { $gte: filters["beds"] } };
      } else if ("property_type" in filters) {
        query = { property_type: { $eq: filters["property_type"] } };
      } else if ("bathrooms" in filters) {
        query = { bathrooms: { $gte: filters["bathrooms"] } };
      }
    }

    let cursor;

    try {
      cursor = await rentals.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { rentalsList: [], totalNumRentals: 0 };
    }

    const displayCursor = cursor.limit(rentalsPerPage).skip(rentalsPerPage * page);

    try {
      const rentalsList = await displayCursor.toArray();
      const totalNumRentals = await rentals.countDocuments(query);

      return { rentalsList, totalNumRentals };
    } catch (e) {
      console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
      return { rentalsList: [], totalNumRentals: 0 };
    }
  }

  static async getProperties() {
    let properties = [];
    try {
      properties = await rentals.distinct("property_type");
      return properties;
    } catch (e) {
      console.error(`Unable to get properties: ${e}`);
      return properties;
    }
  }
}
