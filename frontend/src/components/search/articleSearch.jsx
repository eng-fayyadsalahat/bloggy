import React, {useEffect, useState} from "react";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons'
import "./search.css"

function Search() {

    const [visibile, setVisibile] = useState(false);

    let [data, setData] = useState([]);
    let [inputText, setInputText] = useState("");
    let inputHandler = (e) => {
        let search_input = e.target.value.toLowerCase();
        if (search_input === "") {
            setInputText("");
        } else {
            setInputText(search_input);
        }


    }

    const clearInput = () => {
        setInputText("");
        setVisibile(false);
        setData([]);
    }

    let search_article = async function () {

        try {
            let res = await fetch("/article/search", {
                method: "POST", headers: {
                    'Accept': 'application/json', 'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    search: inputText
                }),
            })// end fetch
            let resJson = await res.json();

            if (res.status === 200) {
                setData(resJson["articles"]);
            }
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if (inputText === "") {
            setData([])
        } else {
            search_article();
        }
    }, [inputText])

    return (<div>
            <div className={!visibile ? "navbar-search" : "show-nav-search navbar-search "}>
                <div>
                    <div className="search-field">
                        <input type="text"
                               className="input-search-field"
                               value={inputText}
                               onChange={inputHandler}
                               placeholder=""
                        ></input>

                        <button className="navbar-search-close" type="button" onClick={clearInput}>
                            <FontAwesomeIcon icon={faTimes} className="far"/>
                        </button>
                    </div>

                    {data.length !== 0 && (<div className="dataResult">
                        {data.slice(0, 15).map((value, key) => {
                            return (<a className="dataItem"
                                       href={"/article/" + value.article_id}
                                       target="_blank"

                            >
                                <p>{value.title} </p>
                            </a>);
                        })}
                    </div>)}

                </div>

                <button
                    className={visibile ? "nav-search-field-toggler" : "show-nav-search nav-search-field-toggler"}
                    type="button"
                    onClick={() => setVisibile(true)}
                >
                    <FontAwesomeIcon icon={faSearch} className="far"/>
                </button>
            </div>
        </div>
    );
}

export default Search;






