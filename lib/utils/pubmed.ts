import { XMLParser } from 'fast-xml-parser';
import type { Article } from '@/lib/types';

const NCBI_BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
const NUM_RESULTS = 15;

export async function searchPubMed(keywords: string[]): Promise<Article[]> {
  if (!keywords.length) return [];

  try {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4;
    const query = `${keywords.join(' ')} AND ${startYear}:${currentYear}[pdat]`;

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text"
    });

    const esearchUrl = `${NCBI_BASE_URL}esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${NUM_RESULTS}&retmode=xml`;
    const esearchResp = await fetch(esearchUrl);
    const esearchXml = await esearchResp.text();
    const esearchData = parser.parse(esearchXml);
    
    const idList = esearchData?.eSearchResult?.IdList?.Id || [];
    if (!Array.isArray(idList) || idList.length === 0) return [];

    const efetchUrl = `${NCBI_BASE_URL}efetch.fcgi?db=pubmed&id=${idList.join(',')}&retmode=xml`;
    const efetchResp = await fetch(efetchUrl);
    const efetchXml = await efetchResp.text();
    const xmlData = parser.parse(efetchXml);
    const articles = xmlData?.PubmedArticleSet?.PubmedArticle || [];

    const articlesArray = Array.isArray(articles) ? articles : [articles];
    if (!articlesArray.length) return [];

    return articlesArray.map((article: any) => {
      const medlineCitation = article.MedlineCitation;
      const articleData = medlineCitation.Article;

      return {
        title: articleData.ArticleTitle['#text'] || articleData.ArticleTitle,
        abstract: articleData.Abstract?.AbstractText?.['#text'] || articleData.Abstract?.AbstractText || 'No abstract available',
        authors: articleData.AuthorList?.Author ? 
          (Array.isArray(articleData.AuthorList.Author) ? articleData.AuthorList.Author : [articleData.AuthorList.Author])
            .map((author: any) => `${author.LastName} ${author.ForeName}`)
          : [],
        published: articleData.Journal?.JournalIssue?.PubDate?.Year || 'Unknown',
        source: 'PubMed',
        url: `https://pubmed.ncbi.nlm.nih.gov/${medlineCitation.PMID['#text']}/`
      };
    });

  } catch (error) {
    console.error('Error processing PubMed articles:', error);
    return [];
  }
} 