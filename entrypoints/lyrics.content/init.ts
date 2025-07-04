import lyricsAutoScroll from './auto-scroll'
import lyricsRomanization from './romanization'
import lyricsStyling from './styling'
import lyricsTranslation from './translation'
import {
  LYRIC_SELECTOR,
  ORIGINAL_LYRIC,
  ROMANIZED_LYRIC,
  TRANSLATED_LYRIC,
} from '@/utils/constants'
import { Content } from '@/utils/messaging'
import { optionsStorage } from '@/utils/storage'

export default async function lyricsInit(container: HTMLElement) {
  // Select only uninitialized lyrics
  const lyrics = document.querySelectorAll<HTMLDivElement>(`${LYRIC_SELECTOR}:not(:has(.${ORIGINAL_LYRIC}))`)

  if (lyrics.length === 0) return

  const lyricElements = new Set<HTMLElement>()

  const toastId = await Content.sendMessage('createToast', {
    text: 'Processing lyrics...'
  })

  // Clear previous elements and add new ones
  lyricElements.clear()

  for (const lyric of lyrics) {
    lyricElements.add(lyric)
    processLyricElement(lyric)
  }

  await Content.sendMessage('destroyToast', toastId)
  await Content.sendMessage('createToast', {
    text: `Found ${lyrics.length} lyric lines!`,
    duration: 1000
  })

  // Get latest options to apply on first open
  const storedOptions = await optionsStorage.getValue()

  // TODO: add auto scroll toggle
  lyricsAutoScroll(container)
  lyricsStyling(storedOptions)
  lyricsRomanization(lyrics, storedOptions.romanization)
  lyricsTranslation(lyrics, storedOptions.translation)
}

function processLyricElement(element: HTMLElement): void {
  const originalLyric = element.textContent?.trim() || ''

  if (!originalLyric) return

  // Create containers for different lyric types
  const originalElement = document.createElement('p')
  originalElement.className = ORIGINAL_LYRIC
  originalElement.textContent = originalLyric

  const romanizedElement = document.createElement('p')
  romanizedElement.className = ROMANIZED_LYRIC

  const translatedElement = document.createElement('p')
  translatedElement.className = TRANSLATED_LYRIC

  // Add all elements to the container
  element.replaceChildren(
    originalElement,
    romanizedElement,
    translatedElement
  )
}
