# data-loader

Data loader exercise for PCS's JSI class.

### `bin/load`

This script will attempt to import the given datafile into your database.

### `lib/dataSource.js`

This module provides low-level base classes for implementing your data transformers ("dataSources").

### `lib/dataSources/`

Place data transformers in individual modules in this directory. Check out [`userSource.js`](blob/master/lib/dataSources/userSource.js) for a simple example of how a dataSource should look.

### `data/`

This directory contains the data files you should load into the database. In order from cleanest to dirtiest, they are:

1. `users.csv` (a simple csv containing a couple of users).
1. `uk_map.json' (a JSON file containing shapes that describe a map of the UK, [drawn from here](http://bl.ocks.org/biovisualize/2322933)).
1. `refugee_nodes.csv` (a CSV file containing country codes and information, [drawn from here](http://bl.ocks.org/ilyabo/2209220)).
1. `applicants-jsi.csv` (a very messy CSV file containing anonymized data about JSI applicants. **Advanced**).
