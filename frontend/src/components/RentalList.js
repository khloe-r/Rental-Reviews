import React, { useState, useEffect } from "react";
import RentalDataService from "../services/Rental";
import { Link } from "react-router-dom";
import { SearchIcon, StarIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { IconButton, Input, Grid, GridItem, Select, Box, Badge, Image, Button, Link as CLink, Alert, AlertIcon } from "@chakra-ui/react";

const RentalList = (props) => {
  const [rentals, setRentals] = useState([]);
  const [page, setPage] = useState(0);
  const [results, setResults] = useState(20);
  const [searchName, setSearchName] = useState("");
  const [searchBeds, setSearchBeds] = useState("");
  const [searchBath, setSearchBath] = useState("");
  const [searchProperty, setSearchProperty] = useState("");
  const [properties, setProperties] = useState(["All Properties"]);

  useEffect(() => {
    retrieveRentals();
    retrieveProperties();
  }, []);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };
  const onChangeSearchBeds = (e) => {
    const searchBeds = e.target.value;
    setSearchBeds(searchBeds);
  };
  const onChangeSearchBath = (e) => {
    const searchBath = e.target.value;
    setSearchBath(searchBath);
  };
  const onChangeSearchProperty = (e) => {
    const searchProperty = e.target.value;
    setSearchProperty(searchProperty);
  };

  const retrieveRentals = (page = 0) => {
    RentalDataService.getAll(page)
      .then((response) => {
        console.log(response.data);
        setRentals(response.data.rentals);
        setResults(response.data.total_results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveProperties = () => {
    RentalDataService.getProperties()
      .then((response) => {
        console.log(response.data);
        setProperties(["All Properties"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveRentals();
  };

  const find = (query, by, pg = 0) => {
    RentalDataService.find(query, by, pg)
      .then((response) => {
        console.log(response.data);
        setRentals(response.data.rentals);
        setResults(response.data.total_results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name");
  };
  const findByBeds = () => {
    find(searchBeds, "beds");
  };
  const findByBath = () => {
    find(searchBath, "bathrooms");
  };
  const findByPropertyType = () => {
    if (searchProperty === "All Properties") {
      refreshList();
    } else {
      find(searchProperty, "property_type");
    }
  };

  const forwardPage = () => {
    retrieveRentals(page + 1);
    setPage(page + 1);
  };
  const backPage = () => {
    retrieveRentals(page - 1);
    setPage(page - 1);
  };

  return (
    <div className="App">
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem w="100%" h="10" colSpan={11}>
          <Input type={"text"} placeholder="Search by Property Name" value={searchName} onChange={onChangeSearchName} />
        </GridItem>
        <GridItem w="100%" h="10">
          <IconButton aria-label="Search by Name" icon={<SearchIcon />} onClick={findByName} />
        </GridItem>
        <GridItem w="100%" h="10" colSpan={3}>
          <Input type={"number"} placeholder="Search by # of Beds" value={searchBeds} onChange={onChangeSearchBeds} />
        </GridItem>
        <GridItem w="100%" h="10">
          <IconButton aria-label="Search by Bed" icon={<SearchIcon />} onClick={findByBeds} />
        </GridItem>
        <GridItem w="100%" h="10" colSpan={3}>
          <Input type={"number"} placeholder="Search by # of Baths" value={searchBath} onChange={onChangeSearchBath} />
        </GridItem>
        <GridItem w="100%" h="10">
          <IconButton aria-label="Search by Bath" icon={<SearchIcon />} onClick={findByBath} />
        </GridItem>
        <GridItem w="100%" h="10" colSpan={3}>
          <Select placeholder="Select option" onChange={onChangeSearchProperty}>
            {properties.map((p) => {
              return <option value={p}>{p}</option>;
            })}
          </Select>
        </GridItem>
        <GridItem w="100%" h="10">
          <IconButton aria-label="Search by Property Type" icon={<SearchIcon />} onClick={findByPropertyType} />
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(12, 1fr)" gap={6} marginTop="10">
        {rentals.map((rental, index) => {
          const rating = Math.floor((rental.review_scores.review_scores_rating / 100) * 5);
          return (
            <GridItem w="100%" colSpan={{ sm: 12, md: 6, lg: 4 }}>
              <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" key={index}>
                <Image src={rental.images.picture_url} alt={`${rental.name} property`} w="100%" h={200} />

                <Box p="6">
                  <Box display="flex" alignItems="baseline">
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                      {rental.property_type}
                    </Badge>
                    <Box color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" textTransform="uppercase" ml="2">
                      {rental.beds} beds &bull; {rental.bathrooms["$numberDecimal"]} baths
                    </Box>
                  </Box>

                  <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1}>
                    {rental.name}
                  </Box>

                  <Box>
                    ${rental.price["$numberDecimal"]}
                    <Box as="span" color="gray.600" fontSize="sm">
                      {" "}
                      / night
                    </Box>
                  </Box>

                  <Box display="flex" mt="2" alignItems="center">
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <StarIcon key={i} color={i < rating ? "teal.500" : "gray.300"} />
                      ))}
                    <Box as="span" ml="2" color="gray.600" fontSize="sm">
                      {rental.number_of_reviews} AirBNB reviews
                    </Box>
                  </Box>

                  <Box display="flex" mt="3">
                    <Button
                      colorScheme="teal"
                      variant="solid"
                      marginEnd="2"
                      as={CLink}
                      href={rental.listing_url}
                      w="50%"
                      _hover={{
                        textDecoration: "none",
                      }}
                      isExternal
                    >
                      View Listing
                    </Button>

                    <Button colorScheme="teal" variant="outline" w="50%" as={Link} to={`/rental/${rental._id}`}>
                      View Reviews
                    </Button>
                  </Box>
                </Box>
              </Box>
            </GridItem>
          );
        })}
      </Grid>
      {results === 0 && (
        <Alert status="error">
          <AlertIcon />
          No results match your search criteria!
        </Alert>
      )}
      <Box display="flex" mt="2" alignItems="center" justifyContent={"center"}>
        {page > 0 && <IconButton aria-label="Back page" icon={<ArrowLeftIcon />} onClick={backPage} />}
        <Button _hover={"none"}>Page {page + 1}</Button>
        {page < results / 20 && <IconButton aria-label="Forward page" icon={<ArrowRightIcon />} onClick={forwardPage} />}
      </Box>
    </div>
  );
};

export default RentalList;
