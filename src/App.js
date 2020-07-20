import React, { useEffect, useState } from "react";
import classNames from "classnames";
import {
  Button,
  Card,
  CardMedia,
  Grid,
  FormControl,
  IconButton,
  TextField,
  withStyles,
} from "@material-ui/core";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import "./App.css";
var _ = require("lodash");
const apiKey = "c80c056c2c4678995f059dda7d8adc8b";
//const apiSecret = "fbe2b5185ea8d799";

const styles = (theme) => ({
  controls: {
    padding: 24,
    width: "100%",
  },
  image: {
    overflow: "hidden",
  },
  layer_holder: {
    height: 400,
  },
  layer_1: {
    height: "100%",
    zIndex: 3,
  },
  layer_2: { height: 400, position: "absolute", zIndex: 2 },
  layer_2_left: {
    right: "48%",
  },
  layer_2_right: {
    left: "48%",
  },
  layer_3: { height: 400, position: "absolute", zIndex: 1 },
  layer_3_left: {
    right: "80%",
  },
  layer_3_right: {
    left: "80%",
  },
  media: {
    maxHeight: 400,
    width: "100%",
  },
  // search: { position: "absolute" },
  slide: { position: "static", minHeight: 300, width: "100%" },
  slide_holder: { height: 400 },
  strip: { width: "100%" },
  wrapper: {
    padding: "24px 0",
  },
  viewing: {
    height: "100%",
  },
});

function App(props) {
  const [searchWords, setSearchWords] = useState("");
  const [photos, setPhotos] = useState([]);
  const [viewing, setViewing] = useState(0);
  const { classes } = props;

  function handleChange(event) {
    setSearchWords(event.target.value);
  }

  const keyAction = (event) => {
    event.key === "Enter" && fetchNewResults();
  };

  useEffect(() => {
    let page = viewing;
    if (viewing < 0) {
      page = 24;
    } else if (viewing > 24) {
      page = 0;
    }
    setViewing(page);
  }, [viewing]);

  const fetchNewResults = () => {
    const words = _.map(_.split(searchWords, ",", 20), _.trim);
    const fWords = _.map(words, encodeURIComponent);
    const formatSearch = _.join(fWords, ",");

    const query = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${formatSearch}&safe_search=1&format=json&nojsoncallback=1`;
    console.log("fetching", words, fWords, formatSearch);
    fetch(query)
      .then((response) => response.json())
      .then((data) => {
        setPhotos(data.photos.photo);
      });
  };

  const CardImage = ({ photo }) => {
    if (photo && photo.farm) {
      const { id, secret, server, title, farm } = photo;
      return (
        <Card raised>
          <CardMedia
            classes={{ root: classes.image }}
            image={`https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`}
          >
            <img
              className={classes.media}
              src={`https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`}
              title={title}
              alt={title}
            />
          </CardMedia>
        </Card>
      );
    } else {
      return "loading";
    }
  };

  const Slideshow = () => {
    const previ = viewing === 0 ? 24 : viewing - 1;
    const previ2 = previ === 0 ? 24 : previ - 1;
    const nexti = viewing === 24 ? 0 : viewing + 1;
    const nexti2 = nexti === 24 ? 0 : nexti + 1;
    const curri = viewing;

    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        classes={{ root: classes.slide_holder }}
      >
        <Grid
          classes={{ root: classNames(classes.layer_3, classes.layer_3_left) }}
          item
          xs={2}
        >
          <Grid
            classes={{ root: classes.layer_holder }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <CardImage photo={photos[previ2]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          classes={{ root: classNames(classes.layer_2, classes.layer_2_left) }}
          item
          xs={5}
        >
          <Grid
            classes={{ root: classes.layer_holder }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <CardImage photo={photos[previ]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid classes={{ root: classes.layer_1 }} xs={8} item>
          <Grid
            classes={{ root: classes.viewing }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <CardImage photo={photos[curri]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          classes={{ root: classNames(classes.layer_2, classes.layer_2_right) }}
          item
          xs={5}
        >
          <Grid
            classes={{ root: classes.layer_holder }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item style={{ maxHeight: 400 }}>
              <CardImage photo={photos[nexti]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          classes={{ root: classNames(classes.layer_3, classes.layer_3_right) }}
          item
          xs={2}
        >
          <Grid
            classes={{ root: classes.layer_holder }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <CardImage photo={photos[nexti2]} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        classes={{ root: classes.wrapper }}
      >
        <Grid classes={{ root: classes.strip }} item xs={12}>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item classes={{ root: classes.slide }}>
              {photos.length > 0 && <Slideshow />}
            </Grid>
          </Grid>
        </Grid>
        <Grid item classes={{ root: classes.controls }}>
          <Grid container>
            <Grid item xs={6}>
              <Grid container spacing={1}>
                <Grid item>
                  <FormControl className={classes.textField} variant="outlined">
                    <TextField
                      label="Search"
                      id="outlined-size-small"
                      helperText="Use comma delimited search terms"
                      variant="outlined"
                      size="small"
                      onChange={handleChange}
                      onKeyPress={keyAction}
                      value={searchWords}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button onClick={() => fetchNewResults()} variant="contained">
                    Find
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right", zIndex: 10 }}>
              <IconButton onClick={() => setViewing(viewing - 1)}>
                <KeyboardArrowLeft />
              </IconButton>
              <IconButton onClick={() => setViewing(viewing + 1)}>
                <KeyboardArrowRight />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default withStyles(styles, { withTheme: false })(App);
