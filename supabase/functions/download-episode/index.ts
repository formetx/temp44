
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Fonction pour télécharger un épisode depuis une URL
async function downloadEpisodeFromUrl(url: string): Promise<Response> {
  try {
    console.log(`Début du téléchargement de : ${url}`)
    
    // Vérifier que l'URL est valide
    if (!url || !url.startsWith('http')) {
      console.error(`URL invalide: ${url}`)
      return new Response(
        JSON.stringify({ error: 'URL invalide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Récupérer le contenu audio depuis l'URL source avec un User-Agent approprié
    console.log(`Envoi de la requête fetch vers: ${url}`)
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'fr,fr-FR;q=0.9,en-US;q=0.8,en;q=0.7',
      'Range': 'bytes=0-',
      'Referer': 'https://www.radiofrance.fr/',
      'Origin': 'https://www.radiofrance.fr',
      'Sec-Fetch-Dest': 'audio',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    }
    
    // Log des headers pour le débogage
    console.log("Headers de requête:", JSON.stringify(headers, null, 2))
    
    const response = await fetch(url, { headers })
    
    console.log(`Statut de la réponse: ${response.status} ${response.statusText}`)
    
    // Log des headers de réponse pour le débogage
    const responseHeaders = Object.fromEntries([...response.headers])
    console.log("Headers de réponse:", JSON.stringify(responseHeaders, null, 2))
    
    if (!response.ok) {
      console.error(`Erreur HTTP: ${response.status} - ${response.statusText}`)
      
      try {
        // Tenter de récupérer le corps de la réponse pour le diagnostic
        const bodyText = await response.text()
        console.error(`Corps de la réponse (début): ${bodyText.substring(0, 200)}...`)
      } catch (bodyError) {
        console.error(`Impossible de lire le corps de la réponse: ${bodyError}`)
      }
      
      return new Response(
        JSON.stringify({ 
          error: `Erreur lors de la récupération du fichier: ${response.status}`,
          details: response.statusText,
          headers: responseHeaders
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Récupérer le type de contenu depuis les en-têtes, par défaut audio/mpeg
    const contentType = response.headers.get('Content-Type') || 'audio/mpeg'
    console.log(`Type de contenu détecté: ${contentType}`)
    
    // Vérifier si le type de contenu indique un fichier audio
    const isAudio = contentType.includes('audio') || 
                    contentType.includes('mpegurl') || 
                    contentType.includes('octet-stream') ||
                    url.endsWith('.mp3') || 
                    url.endsWith('.m4a') || 
                    url.endsWith('.aac')
    
    if (!isAudio) {
      console.warn(`Attention: Le contenu ne semble pas être un fichier audio: ${contentType}`)
    }
    
    // Récupérer les données
    const audioData = await response.arrayBuffer()
    console.log(`Fichier récupéré: ${audioData.byteLength} octets`)
    
    if (audioData.byteLength === 0) {
      console.error("Données vides reçues")
      return new Response(
        JSON.stringify({ error: "Aucune donnée reçue" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Préparer les en-têtes pour le téléchargement
    const downloadHeaders = {
      'Content-Type': contentType,
      'Content-Length': audioData.byteLength.toString(),
      'Content-Disposition': 'attachment',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      'Accept-Ranges': 'bytes'
    }
    
    // Renvoyer directement le contenu avec les en-têtes appropriés
    return new Response(audioData, { headers: downloadHeaders })
  } catch (error) {
    console.error(`Erreur lors du téléchargement: ${error.name}: ${error.message}`)
    console.error(`Stack trace: ${error.stack}`)
    return new Response(
      JSON.stringify({ 
        error: `Erreur interne: ${error.message}`,
        name: error.name,
        stack: error.stack
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Gestionnaire de requêtes
serve(async (req) => {
  console.log(`=== Nouvelle requête: ${req.method} ${req.url} ===`)
  
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    console.log("Requête OPTIONS reçue - Réponse CORS")
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
      console.error(`Méthode non autorisée: ${req.method}`)
      return new Response(
        JSON.stringify({ error: 'Méthode non autorisée' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Récupérer l'URL audio depuis les paramètres de recherche
    const url = new URL(req.url)
    const audioUrl = url.searchParams.get('url')
    console.log(`URL audio demandée: ${audioUrl}`)

    if (!audioUrl) {
      console.error("URL audio manquante dans les paramètres")
      return new Response(
        JSON.stringify({ error: 'URL audio manquante' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Télécharger l'épisode
    console.log(`Appel de downloadEpisodeFromUrl avec: ${audioUrl}`)
    const result = await downloadEpisodeFromUrl(audioUrl)
    console.log(`Téléchargement terminé avec statut: ${result.status}`)
    
    return result
  } catch (error) {
    console.error(`Erreur non gérée lors du traitement de la requête: ${error.name}: ${error.message}`)
    console.error(`Stack trace: ${error.stack}`)
    
    return new Response(
      JSON.stringify({ 
        error: `Erreur serveur: ${error.message}`,
        name: error.name,
        stack: error.stack
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
