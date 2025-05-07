import { useState, useEffect } from "react";
import { AiFillEdit, AiFillCloseCircle } from "react-icons/ai";
import { IoPersonCircleOutline } from "react-icons/io5";

function App() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [field, setField] = useState({ id: "", name: "" });
  const [name, setName] = useState({ id: "", name: "" });
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isFieldVisible, setIsFieldVisible] = useState(false);
  const [allSports, setAllSports] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [option, setOption] = useState([
    {
      id: 1,
      name: "⚽️  Football",
      img: "../src/image/footballCourt.png",
      players: [],
    },
    {
      id: 2,
      name: "🏀  Basketball",
      img: "../src/image/basketballCourt.png",
      players: [],
    },
    {
      id: 3,
      name: "🎾  Tennis",
      img: "../src/image/tennicCourt.png",
      players: [],
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.name.length == 0 && !field.id) {
      alert("Enter the Data...");
      return;
    } else if (name.name.length == 0) {
      alert("Enter the Name...");
      return;
    } else if (name.name.length < 3) {
      alert("The Name is too short...");
      return;
    } else if (!field.id) {
      alert("Choose the sport too");
      return;
    }

    if (editingPlayer) {
      const confirmEdit = confirm(
        `Are you sure you want to edit ${editingPlayer.player} to ${name.name}?`
      );

      if (!confirmEdit) {
        setName({ id: "", name: "" });
        setEditingPlayer(null);
        return;
      }
    }

    setOption((prevOptions) =>
      prevOptions.map((sport) =>
        sport.id === field.id
          ? {
              ...sport,
              players: editingPlayer
                ? sport.players.map((p) =>
                    p.id === editingPlayer.id ? { ...p, player: name.name } : p
                  )
                : [...sport.players, { id: name.id, player: name.name }],
            }
          : sport
      )
    );
    setName({ id: "", name: "" });
    setEditingPlayer(null);
  };

  const deletePlayer = (playerId, name) => {
    const confirmDelete = confirm(
      `Are you sure that you want to delete ${name}?`
    );

    if (!confirmDelete) return;

    setOption((prevOptions) =>
      prevOptions.map((item) =>
        item.id === field.id
          ? { ...item, players: item.players.filter((p) => p.id !== playerId) }
          : item
      )
    );
  };

  const editPlayer = (playerId) => {
    const selectedSport = option.find((item) => item.id === field.id);
    const selectedPlayer = selectedSport?.players.find(
      (p) => p.id === playerId
    );

    if (selectedPlayer) {
      setEditingPlayer(selectedPlayer);
      setName({ id: selectedPlayer.id, name: selectedPlayer.player });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
      if (window.innerWidth > 1000) {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
        setTimeout(() => {
          setIsPageLoaded(true);
        }, 2000);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (field.id) {
      setIsFieldVisible(true);
    }
  }, [field.id]);

  return (
    <>
      {isLoading ? (
        isSmallScreen ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>NEED A BIGGER SCREEN FOR GAME TIME "LAPTOP MAYBE"</p>
            <p>⚽ 🏀 🎾</p>
          </div>
        ) : (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>WARMING UP THE FIELD </p>
            <p>⚽ 🏀 🎾</p>
          </div>
        )
      ) : (
        <div className="wrapper">
          <video width="600" autoPlay loop muted className="bgBackground">
            <source src="../src/image/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {allSports ? (
            <div className="all__sports">
              <div
                className="all__sports-box"
                onClick={() => setAllSports(!allSports)}
              >
                {"<"}
              </div>
              {option &&
                option.map((item) => (
                  <div className="field__players" key={item.id}>
                    <h1 className="field__title">{item.name}</h1>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="field__img"
                    />
                    <div
                      className={
                        field.id ? `field__list` : `field__list-noplayer`
                      }
                    >
                      {item.players.length > 0 ? (
                        item.players.map((player) => (
                          <div key={player.id} className="field__player">
                            <div className="field__player-name fullName">
                              {player.player}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="field__subtitle">
                          No members in {item.name} Club
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <section className="main selected-field">
              <form
                className={`main__form ${isPageLoaded ? "form__active" : ""}`}
                onSubmit={handleSubmit}
                style={
                  isFieldVisible ? { transform: "translate(-130%, -50%)" } : {}
                }
              >
                <h1 className="main__form-title">
                  Signing to <span>Club</span>
                </h1>
                <p className="main__form-subtitle">Join your Sport squad...</p>

                <div className="main__form-selector">
                  <select
                    className="main__form-select"
                    value={field.id}
                    onChange={(e) => {
                      const selectedOption = option.find(
                        (option) => option.id === Number(e.target.value)
                      );
                      setField(selectedOption || { id: "", name: "" });
                    }}
                  >
                    <option
                      disabled
                      value=""
                      className="main__form-option-selected"
                    >
                      Choose the Sport...
                    </option>
                    {option.map((item) => (
                      <option
                        className="main__form-option"
                        value={item.id}
                        key={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className={
                    editingPlayer
                      ? "main__form-inputor-update main__form-inputor"
                      : "main__form-inputor"
                  }
                >
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    className="main__form-input"
                    value={name.name}
                    onChange={(event) =>
                      setName({
                        id: Math.floor(Math.random() * 1000),
                        name: event.target.value,
                      })
                    }
                  />
                  <button type="submit" className="main__form-btn">
                    {editingPlayer ? "UPD" : "ADD"}
                  </button>
                </div>
                <img
                  src="../src/image/club.png"
                  alt=""
                  className="main__form-img"
                />
                <button
                  className="main__all-clubs"
                  onClick={() => {
                    setAllSports(!allSports);
                  }}
                >
                  🤺 All Clubs{" "}
                </button>
              </form>
              <div
                className={`field ${field.id ? "field__active" : ""}`}
                style={
                  isFieldVisible
                    ? { right: "0" }
                    : {
                        right: "-50%",
                        animation: "fieldDisAppear 600ms ease-in-out",
                      }
                }
              >
                <div
                  className="field__hide-btn"
                  onClick={() => {
                    setIsFieldVisible(!isFieldVisible),
                      setTimeout(() => {
                        setField({ id: "", name: "" });
                      }, 2000);
                  }}
                ></div>
                <div className="field__players">
                  {field ? <h1 className="field__title">{field.name}</h1> : ""}
                  {field.id && (
                    <img
                      src={option.find((item) => item.id === field.id)?.img}
                      alt={field.name}
                      className="field__img"
                    />
                  )}
                  <div
                    className={
                      field.id ? `field__list` : `field__list-noplayer`
                    }
                  >
                    {option.find((item) => item.id === field.id)?.players
                      .length > 0 ? (
                      option
                        .find((item) => item.id === field.id)
                        ?.players.map((player) => (
                          <div key={player.id} className="field__player">
                            <div className="field__player-name">
                              {player.player}
                            </div>
                            <div className="field__btn-group">
                              <button
                                className="field__player-edit"
                                onClick={() =>
                                  editPlayer(player.id, player.player)
                                }
                              >
                                <AiFillEdit />
                              </button>
                              <button
                                onClick={() =>
                                  deletePlayer(player.id, player.player)
                                }
                                className="field__player-delete"
                              >
                                <AiFillCloseCircle />
                              </button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div>
                        {field ? (
                          <p className="field__subtitle">
                            No members in {field.name} <br />
                            Be the First ...
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}

export default App;
