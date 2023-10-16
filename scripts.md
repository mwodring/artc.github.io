---
title: Scripts & Tools
before-content: toc_beautiful.html
---

# Master-list of Available Tools

## PrettyTree

A Jupyter binder (Python gist) that runs in your browser. With this, you can use .newick files and generate trees with custom colours. Useful for flagging phylogenies based on genome structures, features, hosts, etc.

Instructions and a link are [here](http://mwodring.github.io/generate_tree.md). You can also run it on your own system if you use Jupyter Lab.

## Annotatr_Basic

An R script to generate plots comparing ORFs, protein features, phobicity, and HTS coverage. Input is designed to fit around Geneious outputs.

The Readme and download can be found at the [GitHub repo](https://github.com/mwodring/Annotatr_Basic).

## QuantPlotter

R script to take .xlsx files outputted by QuantStudio 6 & 7 export function and generate amplification plots, faceted to show six at a time.

Readme and download at [GitHub](https://github.com/mwodring/QuantPlotter).

## Angua-Luggage

A refactor of Sam McGreig's Angua pipeline with additional post-pipeline features (Luggage). Includes the full Annotatr pipeline that finds the ORF (ORFik), protein (pfam) and phobicity (Phobius) data from contigs.

Can also generate a Blast db from the current ICTV meta file and automate mapping reads to references.

Any bugs, please tell Mog.

Instructions on install are on the [GitHub repo](https://github.com/mwodring/Angua_Luggage). You'll need Anaconda or Miniconda.

