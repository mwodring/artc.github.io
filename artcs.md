---
title: Novel Virus Findings
subtitle: Morgan Wodring, Neil Boonham, Fryni Drizou, Kirsty McInnes, Sam McGreig, Ian Adams and Adrian Fox
---

## Novel Virus Findings in Niche Tuber Crops Sourced from eCommerce Websites

Hello! If you're here, you probably read my poster at the IPPC Conference at Lyon, 2023. If you'd like to speak with me (Morgan) further, go ahead and click the 'Contact' link above to find me.

This page covers further details about the work undertaken as part of the PhD under the title above. The aim is to aid in risk assessment and investigate the virome of some [niche crops](#ARTCs) commonly available on e-commerce websites such as eBay within the EPPO region.

## <a name = "ARTCs">ARTCs</a>

Andean Root and Tuber Crops (ARTCs) is a name given to a group of crops, domesticated in the Andes, which are grown for their roots, tubers and rhizomes. Sources differ on the number, but commonly, the following nine are considered to be members:

![Oca]
  (/assets/img/oca_leaf1.png#circ)

* *Oxalis tuberosa*
* *Smallanthus sonchifolius*
* *Ullucus tuberosus*
* *Pachyrhizus ahipa*
* *Lepidium meyenii*
* *Arracacia xanthorrhiza*
* *Canna edulis*
* *Mirabilis expansa*
* *Tropaeolum tuberosum*

## <a name = "methods">Materials and Methods</a>

The samples for the initial HTS run of this PhD came from eBay purchases from France and Poland. These arrived via conventional post, with the Polish set in particular arriving in poor condition. These came in a brown mailing parcel wrapped in newspaper, sold as 'mixed'; many had mould. Once the especially mouldy specimens were discarded, the majority of the tubers did emerge.

Since there were over fifty tubers, those which seemed to be in good health were bulk sampled, where the material was stored in a -80 freezer for later study. The rest had symptoms which could be viral, or due to the poor conditions of the tuber, but seemed the most likely to be infected in order to conserve resources.
The French (9 plants) and Polish (27 plants) were bulked together to form one sample each, along with a bulk of five oca remaining from the previous study. The bulk was formed by sampling individual leaflets at random from each plant and extracting them together using an RNAEasy Plant Mini Kit (re-extracted using the modified CTAB from (ref) for more recalcitrant samples that had poor RNA concentrations as determined by Nanodrop).
These three samples were included in a run of 20 other samples, plus one negative control. Details of read numbers, read length, library prep and indexing will be included with the upcoming paper.

## <a name = "bio">Bioinformatics</a>

The latest version of the Angua (ref) pipeline was used to determine the viruses present in the sample. Briefly, this pipeline used Sickle (present versions use bbduk) to trim adapters and poor quality nucleotides; Trinity to assemble; Blastn on contigs >200 bp long for homology-based assignment; Blastx on contigs >1000bp long; and finally MEGAN to assign these Blast results to taxa based on its built in LCA algorithm.

For further processing I wrote a number of helper scripts, some designed to link into Angua outputs. They form an alternative extension to the pipeline aimed at novel virus discovery rather than diagnosis. An optional mode allows searching for a string within a Blast-generated .xml file, rather than using MEGAN, and extracting contigs assigned to those taxa for further processing.
The chief product of this pipeline extension comes in the form of R-generated graphs for contigs. When provided with the raw reads, this pipeline takes contigs generated from Angua, maps raw reads to them in order to estimate coverage, and uses ORFik to find open reading frames. These open reading frames are then extracted, translated, and examined with Pfam. Lastly, Phobius is used to determine any transmembrane domains in the contig. The result aligns these values to roughly annotate contigs, as a quick means of determining if these contigs are likely to be genuine or were chimeric, or otherwise error-filled. Examples can be seen in [results](#graphs).

## <a name ="graphs">Results</a>

Previous studies from Fera on ARTCs found a handful of novel viruses using the Angua pipeline. These new samples contained four, or possibly five, of the same viruses (this remains to be investigated). The Polish bulk contained one entirely new virus, a Nepovirus likely belonging to subgroup C.

The other viruses belonged to a number of different families:

* [*Nepovirus*](#Nepovirus) - Most of RNA1, coding sequence + part 5' UTR RNA2
* *Ophiovirus* - One small fragment contig
* *Potexvirus* - Complete sequence
* *Allexivirus* 
* *Capulavirus* 
* *Caulimovirus* 

### Nepovirus



## References

Fox, A., et al. (2019). "Using high-throughput sequencing in support of a plant health outbreak reveals novel viruses in *Ullucus tuberosus* (Basellaceae)." Plant Pathology 68: 576-587.
Lebas, B., et al. (2022). "Facilitating the adoption of high‐throughput sequencing technologies as a plant pest diagnostic test in laboratories: A step‐by‐step description." EPPO Bulletin.
Third item