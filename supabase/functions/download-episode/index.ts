
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Fonction pour télécharger un épisode depuis une URL
async function downloadEpisodeFromUrl(url: string): Promise<Response> {
  try {
    // Vérifier que l'URL est valide
    if (!url || !url.startsWith('http')) {
      return new Response(
        JSON.stringify({ error: 'URL invalide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Récupérer le contenu audio depuis l'URL source
    const response = await fetch(url)
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Erreur lors de la récupération du fichier: ${response.status}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Récupérer les données audio
    const audioData = await response.arrayBuffer()
    
    // Renvoyer directement le contenu audio avec les headers appropriés
    return new Response(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment',
        'Access-Control-Allow-Origin': '*', // Permettre CORS
      },
    })
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    return new Response(
      JSON.stringify({ error: `Erreur interne: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Gestionnaire de requêtes
serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
  
  try {
    // Vérifier que la méthode est GET
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Méthode non autorisée' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Récupérer l'URL audio depuis les paramètres de recherche
    const url = new URL(req.url)
    const audioUrl = url.searchParams.get('url')

    if (!audioUrl) {
      return new Response(
        JSON.stringify({ error: 'URL audio manquante' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Télécharger l'épisode
    return await downloadEpisodeFromUrl(audioUrl)
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error)
    return new Response(
      JSON.stringify({ error: `Erreur serveur: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
