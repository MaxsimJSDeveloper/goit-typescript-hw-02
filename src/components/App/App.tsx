import { useState, useEffect } from "react";

import { Toaster } from "react-hot-toast";
import { ImageItem } from "../ImageGallery/ImageGallery.types";
import { getImages, ImageResult } from "../../articles-api";
import SearchForm from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import Error from "../ErrorMessage/ErrorMessage";
import ImageGallery from "../ImageGallery/ImageGallery";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn";
import ImageModal from "../ImageModal/ImageModal";
import ScrollButton from "../ScrollButton/ScrollButton";
import Welcome from "../Welcome/Welcome";

const App = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getImages(query, page);
        console.log(data);

        if (page === 1) {
          setImages(data.map(convertToImageItem));
        } else {
          setImages((prevImages) => [
            ...prevImages,
            ...data.map(convertToImageItem),
          ]);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim() !== "") {
      fetchData();
    }
  }, [query, page]);

  const handleSearch = async (topic: string) => {
    setImages([]);
    setError(false);
    setQuery(topic);
    setPage(1);
  };

  const loadMore = async () => {
    setPage((prevPage) => prevPage + 1);
  };

  const openModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const convertToImageItem = (result: ImageResult): ImageItem => ({
    id: result.id,
    urls: result.urls,
    alt: result.alt_description,
    dscr: result.description,
    likes: result.likes,
  });

  return (
    <>
      <SearchForm onSearch={handleSearch} />
      <ScrollButton />
      {loading && <Loader />}
      {error && <Error />}
      {images.length === 0 && <Welcome />}
      {images.length > 0 && (
        <ImageGallery items={images} onImageClick={openModal} />
      )}
      {images.length > 0 && (
        <LoadMoreBtn onClick={loadMore} loading={loading} />
      )}
      <ImageModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        imageUrl={selectedImageUrl}
      />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
