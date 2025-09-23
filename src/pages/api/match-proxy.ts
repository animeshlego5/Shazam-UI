import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import FormData from 'form-data'
import fetch from 'node-fetch'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const parseForm = (req: NextApiRequest) =>
  new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    const form = formidable({})
    form.parse(req, (err: Error | null, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  try {
    const { files } = await parseForm(req)
    const rawFile = files.file
    let file: formidable.File

    if (Array.isArray(rawFile)) {
      file = rawFile[0]
    } else if (rawFile) {
      file = rawFile
    } else {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const form = new FormData()
    form.append('file', fs.createReadStream(file.filepath), file.originalFilename || 'upload.wav')

    const backendRes = await fetch('https://shazam-efve.onrender.com/match', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    })

    const json = await backendRes.json()
    res.status(backendRes.status).json(json)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}
