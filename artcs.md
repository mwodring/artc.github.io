---
title: Novel Virus Findings
subtitle: Morgan Wodring, Neil Boonham, Fryni Drizou, Kirsty McInnes, Sam McGreig, Ian Adams and Adrian Fox
before-content: toc_beautiful.html
---

# Novel Virus Findings in Niche Tuber Crops Sourced from eCommerce Websites

This page covers further details about the work undertaken as part of the PhD under the title above. The aim is to aid in risk assessment and investigate the virome of some [niche crops](#ARTCs) commonly available on e-commerce websites such as eBay within the EPPO region.

The information here is intended to provide context and to promote interest both in ARTCs and the plant health risks of eCommerce.

As this will be a paper, technical details are largely ommitted here, but you are of course welcome to quiz me.

## <a name="ARTCs">ARTCs</a>

Andean Root and Tuber Crops (ARTCs) is a name given to a group of crops, domesticated in the Andes, which are grown for their roots, tubers and rhizomes. Sources differ on the number, but commonly, the following nine are considered to be members:

![Oca leaves. They are small, dark green leaves, like a clover, with red stems.](/assets/img/oca_leaf1.jpg#circ){: .mx-auto.d-block :}

* *Oxalis tuberosa*
* *Smallanthus sonchifolius*
* *Ullucus tuberosus*
* *Pachyrhizus ahipa*
* *Lepidium meyenii*
* *Arracacia xanthorrhiza*
* *Canna edulis*
* *Mirabilis expansa*
* *Tropaeolum tuberosum*
{: style="text-align: center; list-style-position: inside;"}

## <a name="why">Why ARTCs</a>

ARTCs remain a niche crop outside of their Andean homelands. However, they are grown in Europe and have been in some form or another for cenutiries. In France they were once called truffete acide - given the venue, some of you may be able to tell me if that's still the case! They were grown as food, as they are in South America. In England they once had some popularity as ornamentals, but in recent years they have been grown as allotment plants. A number of horticultural hobbyist websites recommend them, and even the newspaper. Below is a photograph from an English newspaper with oca tubers as an example crop to grow in response to food insecurity.

![A photograph of a newspaper article titled 'How to feed 8 billion people' with a picture of oca tubers in the top left.](/assets/img/newspaper.jpg){: .mx-auto.d-block :}

## <a name="material">Material</a>

The samples tubers samples are from from eBay purchases from France and Poland. These arrived via conventional post, with the Polish set in particular arriving in poor condition. These came in a brown mailing parcel wrapped in newspaper, sold as 'mixed'; many had mould. Later tubers purchased from the UK and from mainland Europe came in varied condition. In some cases, plants were mislabelled as flavourings or cosmetics. It's likely this was intentional to avoid customs inspections.

In addition, some older samples came from RHS Hyde Hall's global growth garden. 

Once emerged, many plants had symptoms which could be viral, or due to the poor conditions of the tuber. This highlights some of the difficulty in assessing plants less familiar to an importing country for syptoms.
The French (9 plants) and Polish (27 plants) samples were bulked together to form one sample each, along with a bulk of five oca remaining from the previous study.

## <a name="summary">Novel Viruses</a>

The putative viruses found belonged to five different genera:

* [Nepovirus](#Nepovirus) - Most of RNA1, coding sequence + part 5' UTR RNA2. Distantly related to Cherry leaf roll virus, *Nepovirus avii*.
* *Ophiovirus* - Most of the genome. Distantly related to Blueberry mosaic associated virus, *Ophiovirus vaccinii*. A second virus in this genus was found by phylogeny and sequence alignment of Ophiovirus contigs. 
* [Potexvirus](#Potexvirus) - Complete sequence. Related to *Mint virus X* and *Cardamom virus X*.
* [Allexivirus](#Allexivirus) - Entire coding sequence. Clusters with the non-garlic Allexiviruses but portions are most closely related to Acarallexiviruses by identity. No post-CP ORF; TGBP3 lacks AUG start codon.
* *Capulavirus* - Large potion of the genome; unlikely to be an EVE. Related to *Caput medusae latent virus*. Rolling circle amplification has been performed but the sequence that was amplified has yet to be confirmed as this virus.
* *Caulimovirus* - Unknown genome portion; recovered from the 'root' node in MEGAN software; investigation underway into whether the sequence is an EVE. It is likely there are two Caulimoviruses or EVEs derived from Caulimoviruses in the samples.

In addition, a likely novel satellite related to ArMV satellite was found.

### Nepovirus

#### RNA-1

![A graph of the genome and coverage of the largest Nepovirus contig matching RNA1. Coverage is highest at the start of the polymerase region of polyprotein 1. Two trans-membrane domains mark the start and end of the Helicase region. The graph stacks ORFs, coverage, and the domains in frame 1.](/assets/img/ONV1_RNA1.jpg){: .mx-auto.d-block :}

#### RNA-2 

![A graph of the genome and coverage of the largest Nepovirus contig matching RNA2. Coverage is highest in the 5 prime UTR. The graph stacks ORFs, coverage, and the domains in frame 1.](/assets/img/ONV1_RNA2.jpg){: .mx-auto.d-block :}

### Potexvirus 

![A graph of the genome and coverage of the largest Potexvirus contig. There are two high coverage regions in the first ORF (replicase) and another in the TGBP1 region. The graph stacks ORFs, coverage, and the domains in frame 1.](/assets/img/potex_graph.jpeg){: .mx-auto.d-block :}

### Allexivirus 

ORFs with an AUG start codon are shown. An additional start codon with the leaky GUG codon found in some Allexiviruses as also find matching in sequence identity to TGBP3 of other Allexiviruses. In this graph, MT stands for methyltransferase.

![A graph of the genome and coverage of the novel Allexivirus. The coverage is highest at the end of ORF1 (replicase gene), with spikes in the triple gene block region and ORF4, the 40kDa protein of unknown function common in Allexiviruses. The graph stacks AUG/ATG ORFs, coverage, and the domains in frame 1.](/assets/img/allexi_graph.jpeg){: .mx-auto.d-block :}

## <a name = "bio">Bioinformatics</a>

The latest version of the Angua pipeline was used to determine the viruses present in the sample. Briefly, this pipeline used Sickle (present versions use bbduk or Trimmomatic) to trim adapters and poor quality nucleotides; Trinity to assemble; Blastn on contigs >200 bp long for homology-based assignment; Blastx on contigs >1000bp long; and finally MEGAN to assign these Blast results to taxa based on its built in LCA algorithm.

For further processing I wrote a number of helper scripts, some designed to link into Angua outputs. They form an alternative extension to the pipeline aimed at novel virus discovery rather than diagnosis. An optional mode allows searching for a string within a Blast-generated .xml file, rather than using MEGAN, and extracting contigs assigned to those taxa for further processing.
The chief product of this pipeline extension comes in the form of R-generated graphs for contigs. When provided with the raw reads, this pipeline takes contigs generated from Angua, maps raw reads to them in order to estimate coverage, and uses ORFik to find open reading frames. These open reading frames are then extracted, translated, and examined with Pfam. Lastly, Phobius is used to determine any transmembrane domains in the contig. The result aligns these values to roughly annotate contigs, as a quick means of determining if these contigs are likely to be genuine or were chimeric, or otherwise error-filled. Examples can be seen in [results](#graphs).

A rewrite of Angua to use Spades for e.g. small RNA seq is in the testing stage.

## Grow Your Own

Annotatr is part of the Angua-Luggage conda environment that runs on Linux, but a smaller version can take pre-made YAML files and generate a plot like that above using just R.

For more info on these, look under the Projects tab or check my [tools landing page](http://mwodring.github.io/scripts)

## References & Additional Reading

1. Fox, A., et al. (2019). "Using high-throughput sequencing in support of a plant health outbreak reveals novel viruses in *Ullucus tuberosus* (Basellaceae)." Plant Pathology 68: 576-587.
2. Lebas, B., et al. (2022). "Facilitating the adoption of high‐throughput sequencing technologies as a plant pest diagnostic test in laboratories: A step‐by‐step description." EPPO Bulletin.