import { Card, Spin, Table, Tag } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import Meta from "antd/lib/card/Meta";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { PageHeaderContext } from "../app/App";
import PokemonService, { IPokemonDetail } from "../services/PokemonService";

const DetailPokemon = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const pageHeaderContext = useContext(PageHeaderContext);
  const [pokemon, setPokemon] = useState<IPokemonDetail>();

  useEffect(() => {
    if (pokemon) {
      return;
    }

    pageHeaderContext?.setTitle("Pokédex");
    pageHeaderContext?.setOnBack(() => () => history.push(`/?goto=${id}`));

    PokemonService.getPokemon(parseInt(id)).then((result) => {
      pageHeaderContext?.setSubTitle(`#${id} ${result.name}`);
      setPokemon(result);
    });
  }, [history, id, pageHeaderContext, pokemon]);

  if (!pokemon) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  return (
    <Card
      style={{ width: "100%" }}
      cover={
        <Avatar
          src={pokemon.sprites.other["official-artwork"].front_default}
          size={256}
        />
      }
    >
      <Meta
        title={pokemon.name}
        description={
          <div>
            {pokemon.species.text}
            <br />
            <br />
            {pokemon.types.map((type) => (
              <Tag>{type.type.name}</Tag>
            ))}
            <br />
            <br />
            <Table
              pagination={false}
              columns={[
                {
                  title: "Stats",
                  dataIndex: "stat",
                  key: "stat",
                  render: (stat) => stat.name,
                },
                {
                  title: "Base Stat",
                  dataIndex: "base_stat",
                  key: "base_stat",
                },
                {
                  title: "Effort",
                  dataIndex: "effort",
                  key: "effort",
                },
              ]}
              dataSource={pokemon.stats}
            />
          </div>
        }
      />
    </Card>
  );
};

export default DetailPokemon;
