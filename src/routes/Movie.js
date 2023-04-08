import { useParams } from "react-router-dom";
import { gql, useQuery} from "@apollo/client"
import styled from "styled-components";

const GET_MOVIE = gql`
    query getMovie($movieId:String!){
        movie(id:$movieId){
            id
            title
            medium_cover_image
            rating
            description_full
            description_intro
            isLiked @client
        }
    }
`;

const Container = styled.div`
  height: 100vh;
  background-image: linear-gradient(-45deg, #d754ab, #fd723a);
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
  position: fixed;
`;

const Column = styled.div`
  margin-left: 10px;
  width: 50%;
`;

const Title = styled.h1`
  font-size: 65px;
  margin-bottom: 15px;
`;

const Subtitle = styled.h4`
  font-size: 35px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 20px;
  padding: 15px 0px;
`;

const Image = styled.div`
  width: 25%;
  height: 60%;
  background-color: transparent;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
  border-radius: 7px;
`;

const Button = styled.button`
    width: 50px;
    height: 50px;
    border-color: white;
    font-size: 30px;
    background-color: transparent;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    
`;

export default function Movie(){
    const { id } = useParams();
    const {data, loading, client: { cache }} = useQuery(GET_MOVIE, {
        variables:{
            movieId: id,
        }
    });
    const onClick = () => {
        cache.writeFragment({
            id:`Movie:${id}`,
            fragment: gql`
                fragment MovieFragment on Movie{
                    isLiked
                }
            `,
            data: {
                isLiked: !data.movie.isLiked,
            }
        })
    };

    return (
        <Container>
          <Column>
            <Title>{loading ? "Loading..." : `${data.movie?.title}`}</Title>
            <Subtitle>⭐️ {data?.movie?.rating}</Subtitle>
            <Description>{data?.movie?.description_full}</Description>
            <Button onClick={onClick}>{data?.movie?.isLiked? "🤔" : "😆"}</Button>
          </Column>
          <Image bg={data?.movie?.medium_cover_image} />
        </Container>
      );
}