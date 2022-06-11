import http from "../http-common";

class RentalDataService {
  getAll(page = 0) {
    return http.get(`?page=${page}`);
  }

  find(query, by = "name", page = 0) {
    return http.get(`?${by}=${query}&page=${page}`);
  }

  createReview(data) {
    return http.post("/review", data);
  }

  updateReview(data) {
    return http.put("/review", data);
  }

  deleteReview(id) {
    return http.delete(`/review?id=${id}`);
  }

  getProperties(id) {
    return http.get(`/property-types`);
  }
}

export default new RentalDataService();
