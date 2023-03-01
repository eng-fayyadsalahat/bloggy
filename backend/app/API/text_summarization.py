import re
import string
from nltk import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from spacy import load


def clean_punctuation(text: str) -> str:
    """
    Return a string
    Remove punctuation from text

    :param text:
    :return: clean text
    """
    clean_text = (re.sub("[%s]" % re.escape(string.punctuation), "", text)).strip()
    return clean_text


nlp = load("en_core_web_lg", disable=['tagger', 'perser', 'ner'])

stop_words = stopwords.words('english')


def text_lemmatized(text: str) -> str:
    """
    return String
    lemmatize a text using spacy model
    :param text:
    :return: lemma text
    """
    doc = nlp(text)
    lemma_text = [str(word.lemma_) if word.lemma_ != "-PRON-" else str(word) for word in doc]
    return " ".join(lemma_text)


def clean_numbers(text: str) -> str:
    """
    return String
    Remove numbers from text
    :param text:
    :return: clean text
    """
    clean_text = re.sub(r"\w*\d\w*", "", text)
    return clean_text


def encode_text(text: str) -> str:
    """
    Remove ascii char,
    to return a unicode string without any ascii char,
    decode this string in utf-8.
    :param text:
    :return: text: str
    """
    clean_text = text.encode("ascii", "ignore")
    return str(clean_text.decode("utf-8"))


def remove_emoji(text: str) -> str:
    """
        Remove ascii char,
        to return a unicode string without any ascii char,
        like emoji.
        :param text:
        :return: text: str
        """

    emoji_pattern = re.compile("["
                               u"\U0001F600-\U0001F64F"  # emoticons
                               u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                               u"\U0001F680-\U0001F6FF"  # transport & map symbols
                               u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                               u"\U00002500-\U00002BEF"  # chinese char
                               u"\U00002702-\U000027B0"
                               u"\U00002702-\U000027B0"
                               u"\U000024C2-\U0001F251"
                               u"\U0001f926-\U0001f937"
                               u"\U00010000-\U0010ffff"
                               u"\u2640-\u2642"
                               u"\u2600-\u2B55"
                               u"\u200d"
                               u"\u23cf"
                               u"\u23e9"
                               u"\u231a"
                               u"\ufe0f"  # dingbats
                               u"\u3030"
                               "]+", flags=re.UNICODE)
    return emoji_pattern.sub(r" ", text)


def just_word(text: str) -> str:
    """

    :param text:
    :return:
    """
    string_pattern = re.compile("["
                                u"\U00000041-\U0000005A"
                                u"\U00000061-\U0000007A"
                                "]+", flags=re.UNICODE)

    pure_text = string_pattern.findall(text)
    return " ".join(pure_text)


def clean_stopwords(text: str, stop_words) -> str:
    """
    Remove stop word from text
    nltk stop word
    :param text:
    :param stop_words:
    :return:
    """
    wordList = word_tokenize(text)
    clean_text = []
    for word in wordList:
        if word in stop_words:
            continue
        else:
            clean_text.append(word + " ")
    return "".join(clean_text)


def frequency_table(text):
    try:

        stop_words = stopwords.words("english")
        text = pure_article(text)
        words = word_tokenize(text)
        freq_table = dict()
        for word in words:
            if word in stop_words:
                continue
            if word in freq_table:
                freq_table[word] += 1
            else:
                freq_table[word] = 1

        return freq_table

    except BaseException as e:
        print(e, "frequency_table")


def score_sentences(sentences, freqTable):
    try:
        sentenceValue = dict()
        for sentence in sentences:
            for word, freq in freqTable.items():
                if word in sentence.lower():
                    if sentence in sentenceValue:
                        sentenceValue[sentence] += freq
                    else:
                        sentenceValue[sentence] = freq
        return sentenceValue
    except BaseException as e:
        print(e, "score_sentences")


def find_average_score(sentenceValue) -> int:
    sumValues = 0
    for sentence in sentenceValue:
        sumValues += sentenceValue[sentence]

    # Average value of a sentence from original text
    average = int(sumValues / len(sentenceValue))

    return average


def generate_summary(sentences, sentenceValue, average):
    sentence_count = 0
    summary = ''

    for sentence in sentences:
        if sentence in sentenceValue and sentenceValue[sentence] > (1.2 * average):
            summary += " " + sentence
            sentence_count += 1

    return summary


def pure_article(article: str) -> str:
    text = clean_numbers(article)
    text = clean_punctuation(text).lower()
    text = remove_emoji(text)
    text = just_word(text)
    lemma_text = text_lemmatized(text)
    lemma_text = clean_stopwords(lemma_text, stop_words)
    return lemma_text


def sentences_tokenizer(text: str) -> list:
    """
    Function return sentences tokenizer of text
    after text preprocessing
    :param sentences: list
    :return: sentences tokenizer: list
    """
    sentences = sent_tokenize(text)
    new_sentences = list()
    for sentence in sentences:
        new_sentences.append(pure_article(str(sentence)))
    return [item for item in new_sentences if item != ""]


def article_summary(article):
    freq_table = frequency_table(article)

    # 2 Tokenize the sentences
    sentences = sentences_tokenizer(article)

    # 3 Important Algorithm: score the sentences
    sentence_scores = score_sentences(sentences, freq_table)

    # 4 Find the average
    average = find_average_score(sentence_scores)

    # 5 Important Algorithm: Generate the summary
    summary = generate_summary(sentences, sentence_scores, average)

    return summary + "."

