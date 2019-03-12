<style>
    img[src*="#logo"] {
        width:150px;
        height:100px;
    }

    img[src*="#gif"] {
        width:300px;
        margin: 0 auto
    }
</style>

## fbranch

![](logo.png#logo)

This is a cli tool to quickly switch between git branches

![](fbranch.gif#gif)

## Install

```sh
npm install --global fbranch
```

## Usage

To fuzzy search and checkout a branch by query

```sh
fbranch <query>
```

To search and checkout interactively

```
fbranch -i
```
