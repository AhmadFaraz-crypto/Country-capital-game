import React, { useEffect, useRef, useState } from "react";

const data = {
  "Germany": "Berlin",
  "Azerbaijan": "Baku",
  "Poland": "Warszawa",
  "Papua New Guinea": "Port Moresby",
};

const CountryCapitalGame = () => {
  const valuesRef = useRef(Object.entries(data));
  const [entries, setEntries] = useState({});

  const [state, setState] = useState({
    country: "",
    capital: "",
    duplicateCountry: "",
    duplicateCapital: "",
    wrongVal: false,
    filterData: [],
  });

  const updateState = (values) => {
    setState((prev) => ({
      ...prev,
      ...values,
    }));
  };

  useEffect(() => {
    shuffleData(data);
  }, []);

  const shuffleData = (values) => {
    const shuffleObjectKeys = Object.keys(values).sort(() => Math.random() - 0.5);
    const shuffleObjectValues = Object.values(values).sort(() => Math.random() - 0.5);
    const newArr = shuffleObjectKeys.map((ele, index) => ({[ele] : shuffleObjectValues[index]}));
    const newEntries = Object.assign({}, ...newArr);
    setEntries(Object.entries(newEntries));
  }

  const getFilterData = (val1, val2) => {
    let filter = [];
    if (val1) {
      filter = valuesRef.current.filter(
        ([key, _]) => key.toLowerCase() === val1.toLowerCase()
      );
    } else {
      filter = valuesRef.current.filter(
        ([_, val]) => val.toLowerCase() === val2.toLowerCase()
      );
    }
    const find = filter.find(d => d);
    updateState({ filterData: find });
  };

  const add = (val1, val2) => {
    if (!state.country && val1) {
      updateState({ country: val1 });
      getFilterData(val1, null);
    } else if (!state.capital && val2) {
      updateState({ capital: val2 });
      getFilterData(null, val2);
    } else if (state.country && val1 && !state.duplicateCountry) {
      updateState({ duplicateCountry: val1 });
    } else if (state.capital && val2 && !state.duplicateCapital) {
      updateState({ duplicateCapital: val2 });
    }
    if (state.wrongVal) {
      updateState({
        country: "",
        capital: "",
        duplicateCapital: "",
        duplicateCountry: "",
      });
    }
    updateState({ wrongVal: false });
    check(val1, val2);
  };

  const check = (val1, val2) => {
    const selectedCountry = state.country ? state.country : val1;
    const selectedCapital = state.capital ? state.capital : val2;
    if (
      !state.wrongVal &&
      state.filterData[0]?.toLowerCase() ===
        selectedCountry?.toLowerCase() &&
      state.filterData[1]?.toLowerCase() === selectedCapital?.toLowerCase()
    ) {
      const removeSelected = valuesRef.current.filter(
        ([key, _]) => key.toLowerCase() !== selectedCountry.toLowerCase()
      );
      updateState({ country: "", capital: "" });
      valuesRef.current = removeSelected;
      shuffleData(Object.fromEntries(removeSelected));
    } else if (state.wrongVal && val1) {
      updateState({ country: val1 });
    } else if (state.wrongVal && val2) {
      updateState({ capital: val2 });
    } else if (state.country || state.capital) {
      updateState({ wrongVal: true });
    } else {
      return null;
    }
  };

  return (
    <div className="App">
      <h1>Country Capitals Game</h1>
      {entries.length ? (
        entries.map(([key, val]) => (
          <div>
            <button
              style={
                state.country.toLowerCase() === key.toLowerCase() &&
                !state.wrongVal
                  ? { backgroundColor: "#0000ff" }
                  : (state.country.toLowerCase() === key.toLowerCase() ||
                      state.duplicateCountry.toLowerCase() ===
                        key.toLowerCase()) &&
                    state.wrongVal
                  ? { backgroundColor: "#FF0000" }
                  : {}
              }
              onClick={() => add(key, null)}
            >
              {key}
            </button>
            <button
              style={
                state.capital === val && !state.wrongVal
                  ? { backgroundColor: "#0000ff" }
                  : (state.capital.toLowerCase() === val.toLowerCase() ||
                      state.duplicateCapital.toLowerCase() ===
                        val.toLowerCase()) &&
                    state.wrongVal
                  ? { backgroundColor: "#FF0000" }
                  : {}
              }
              onClick={() => add(null, val)}
            >
              {val}
            </button>
          </div>
        ))
      ) : (
        <p>Congratulations</p>
      )}
    </div>
  );
};

export default CountryCapitalGame;
