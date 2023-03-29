import openai 
import numpy as np
import logging 
import json

max_requests_per_minute = 20
max_tokens_per_minute = 40000
max_tokens_per_request = 2000

# no more than 4000 token per request

def processingFileWithDeepGram(file,dg_client,prompt0,tasklist=[]):
    # translate the audio file to text
    output = dg_client.transcription.sync_prerecorded(file,{'paragraphs': True})
    result = output['results']['channels'][0]['alternatives'][0]
    message = [{"role": "assistant", "content": prompt0}]
    paragraphs = result['paragraphs']['transcript']
    logging.debug("paragraphs: " + str(paragraphs))

    userPrompt = {"tasklist": tasklist, "content": paragraphs}
    message.append({"role": "user", "content": userPrompt})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages = message,
        max_tokens=500,
        temperature=0,
    )
    ans = response['choices'][0]['message']['content']
    print(ans)
    print(ans[0])
    return ans

def processingFile(file,is_video,whisper_model,prompt0):
    # translate the audio file to text
    logging.debug("transcribing audio")
    output = whisper_model.transcribe(file)
    text = output['text']
    allwords=text.split(" ")

    num_tokens = len(allwords)
    prompt0_tokens = len(prompt0.split(" "))
    div_part = (num_tokens) // (max_tokens_per_request - prompt0_tokens)
    mod_part = (num_tokens) % (max_tokens_per_request - prompt0_tokens)
    if mod_part > 0:
        div_part += 1

    parts = np.array_split(allwords, div_part)
    # split the text into 20,000 tokens
    logging.debug("num_tokens: " + str(num_tokens))

    for i in range(div_part):
        para = ' '.join(parts[i])
        prompt = f"{prompt0} {para}"    
        logging.debug(f"prompt{i}: " + prompt + "\n\n\n")

    logging.debug("requesting openai")

    logging.debug("request done")

    summary = ""

    return summary


