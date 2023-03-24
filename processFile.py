import openai 
import numpy as np
import logging 

max_requests_per_minute = 20
max_tokens_per_minute = 40000

async def processingFile(file,is_video,whisper_model,prompt0):
    # check the file type
    if is_video :
        # if the file is video, convert it to audio
        file = convertVideoToAudio(file)
    # process the audio file

    # translate the audio file to text
    output = whisper_model.transcribe(file)
    text = output['text']
    allwords=text.split(" ")

    num_tokens = len(allwords)
    div_part = num_tokens // max_tokens_per_minute
    mod_part = num_tokens % max_tokens_per_minute
    if mod_part > 0:
        div_part += 1

    parts = np.array_split(allwords, div_part)
    # split the text into 20,000 tokens
    logging.debug("num_tokens: " + str(num_tokens))

    para = ' '.join(parts[0])
    prompt = f"{prompt0} {para}"    
    openai.key_api = "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"

    logging.debug("requesting openai")
    response0 = openai.Completion.create(
    model="gpt-3.5-turbo",
    prompt=prompt,
    temperature=0,
    max_tokens=100,
    top_p=1.0,
    frequency_penalty=0.0,
    presence_penalty=1
    )
    logging.debug("request done")

    summary = response0['choices'][0]['text']

    return summary


