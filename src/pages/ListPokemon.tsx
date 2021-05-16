import React, { useContext, useEffect, useRef, useState } from "react";
import PokemonService, { IPokemonList } from "../services/PokemonService";
import { List, Spin } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { useHistory, useLocation } from "react-router";
import { PageHeaderContext } from "../app/App";

const ListPokemon = () => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const goto = query.get("goto");
  const [pokemons, setPokemons] = useState<IPokemonList>({
    count: 1,
    results: [],
  });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const refToScroll = useRef<HTMLDivElement>(null);

  const pageHeaderContext = useContext(PageHeaderContext);
  useEffect(() => {
    pageHeaderContext?.setOnBack(undefined);
    pageHeaderContext?.setTitle("Pokédex");
    pageHeaderContext?.setSubTitle("gotta catch 'em all");
  }, [pageHeaderContext]);

  const loadMorePokemon = (page: number) => {
    setLoading(true);
    return PokemonService.listPokemon(10, (page - 1) * 10)
      .then((result) => {
        setHasMore(
          result.count > pokemons.results.length + result.results.length
        );
        setPokemons((p) => {
          return {
            ...p,
            results: p.results.concat(result.results),
          };
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (hasMore && !loading) {
      loadMorePokemon(page).then(() => setPage((p) => p + 1));
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (!hasMore && !loading && goto && refToScroll.current) {
      refToScroll.current!.scrollIntoView();
    }
  }, [hasMore, loading, goto]);

  if (loading || hasMore) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  return (
    <List
      dataSource={pokemons.results}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          onClick={() => {
            history.push(`/${item.id}`);
          }}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={item.sprite}
                style={{
                  marginLeft: "1rem",
                }}
              />
            }
            style={{ cursor: "pointer" }}
            description={`#${item.id}`}
            title={
              <div
                ref={goto && parseInt(goto) === item.id ? refToScroll : null}
              >
                {item.name}
              </div>
            }
          />
        </List.Item>
      )}
    ></List>
  );
};

export default ListPokemon;
