import { JSX, TargetedEvent } from 'preact/compat'
import { languages } from 'google-translate-api-x'
import moegiLogo from '@/assets/moegi.svg'
import { moegiOptions } from '@/services/options'
import Checkbox from './components/Checkbox'
import Input from './components/Input'
import Select, { SelectProps } from './components/Select'
import { formInputHandler, resetStorageHandler } from './handler'

type FormEventHandler = JSX.EventHandler<TargetedEvent<HTMLFormElement, Event>>

export default function Popup() {
  const translationLanguages = Object.entries(languages)
    .map(([value, text]) => ({ text, value }))

  const selects: SelectProps[] = [
    {
      label: 'To',
      name: 'to',
      options: [
        { text: 'Romaji', value: 'romaji' },
        { text: 'Hiragana', value: 'hiragana' },
        { text: 'Katakana', value: 'katakana' },
      ]
    },
    {
      label: 'Mode',
      name: 'mode',
      options: [
        { text: 'Normal', value: 'normal' },
        { text: 'Spaced', value: 'spaced' },
        { text: 'Okurigana', value: 'okurigana' },
        { text: 'Furigana', value: 'furigana' },
      ]
    },
    {
      label: 'Romaji System',
      name: 'romajiSystem',
      options: [
        { text: 'Hepburn', value: 'hepburn' },
        { text: 'Nippon', value: 'nippon' },
        { text: 'Passport', value: 'passport' },
      ],
      disabled: (moegiOptions.value.to !== 'romaji')
    }
  ]

  return (
    <main class="p-4 min-w-64 bg-background color-text text-xs">
      <form
        id="form"
        class="flex flex-col gap-2"
        onInput={formInputHandler as FormEventHandler}
      >

        <div class="mb-4 flex gap-2 justify-center items-center">
          <img class="w-12 square" src={moegiLogo} alt="Moegi Logo" />
          <h1 class="font-bold text-2xl text-center">もえぎ</h1>
        </div>

        <div class="flex flex-col gap-2">
          <Checkbox name="translation">
            <strong>Translation</strong>
          </Checkbox>


          <Checkbox name="romanization">
            <strong>Japanese Romanization</strong>
          </Checkbox>

          {(moegiOptions.value.translation || moegiOptions.value.romanization) &&
            <Checkbox name="hideOriginal">Hide Original Lyrics</Checkbox>
          }
        </div>

        { moegiOptions.value.translation &&
          <>
            <hr class="my-2" />
            <p><strong>Translation Options:</strong></p>
            <div class="grid gap-2">
              <Select
                label="Language Target"
                name="languageTarget"
                options={translationLanguages}
              />
            </div>
          </>
        }
        { moegiOptions.value.romanization &&
          <>
            <hr class="my-2" />
            <p><strong>Romanization Options:</strong></p>
            <div class="grid grid-cols-2 gap-2">

              { selects.map((select) => (<Select {...select} />)) }

              <div class="col-span-2 grid grid-cols-4 gap-2">
                <p class="col-span-4 text-center">Okurigana Delimiter</p>
                <Input
                  label="Start"
                  name="delimiter_start"
                  placeholder="("
                  disabled={moegiOptions.value.mode !== 'okurigana'}
                />
                <Input
                  label="End"
                  name="delimiter_end"
                  placeholder=")"
                  disabled={moegiOptions.value.mode !== 'okurigana'}
                />
              </div>
            </div>
          </>
        }

        <button
          id="reset"
          class="mt-2 p-2 bg-accent color-light text-bold"
          type="button"
          onClick={resetStorageHandler}
        >
          Reset to defaults
        </button>
      </form>
    </main>
  )
}
