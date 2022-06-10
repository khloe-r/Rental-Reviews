import RentalsDAO from "../dao/rentalsDAO.js";

export default class RentalsCtrl {
  static async apiGetRentals(req, res, next) {
    const rentalsPerPage = req.query.rentalsPerPage ? parseInt(req.query.rentalsPerPage, 10) : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.beds) {
      filters.beds = parseInt(req.query.beds, 10);
    } else if (req.query.property_type) {
      filters.property_type = req.query.property_type;
    } else if (req.query.name) {
      filters.name = req.query.name;
    } else if (req.query.bathrooms) {
      filters.bathrooms = parseInt(req.query.bathrooms, 10);
    }

    const { rentalsList, totalNumRentals } = await RentalsDAO.getRentals({ filters, page, rentalsPerPage });

    let response = {
      rentals: rentalsList,
      page: page,
      filters: filters,
      entries_per_page: rentalsPerPage,
      total_results: totalNumRentals,
    };
    res.json(response);
  }

  static async apiGetRentalProperties(req, res, next) {
    try {
      let properties = await RentalsDAO.getProperties();
      res.json(properties);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
