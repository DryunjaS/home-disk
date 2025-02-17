import { useEffect, useState } from "react";
import CatalogService from "../service/CatalogService";
import {
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ruRU } from "@mui/x-data-grid/locales";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import TopicIcon from "@mui/icons-material/Topic";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Icatalog } from "../type";
import ModalRename from "../modal/ModalRename";
import ModalDelete from "../modal/ModalDelete";
import Cookie from "js-cookie";

const columns: GridColDef[] = [
  { field: "id", headerName: "Номер", width: 100 },
  {
    field: "type",
    headerName: "Тип",
    width: 100,
    renderCell: (params) =>
      params.row.type === "каталог" ? (
        <Tooltip title="каталог" placement="right">
          <TopicIcon />
        </Tooltip>
      ) : (
        <Tooltip title="файл" placement="right">
          <InsertPhotoIcon />
        </Tooltip>
      ),
  },

  { field: "name", headerName: "Название", width: 250 },
];

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
const SERVER_URL = import.meta.env.VITE_REACT_APP_API_URL;

const MainPage = () => {
  const [catalogs, setCatalogs] = useState<Icatalog[]>([]);
  const [url, setUrl] = useState("/static");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

  const handleSelectionChange = (newSelection: any) => {
    const selectedNames = newSelection
      .map((id: number) => {
        const item = catalogs.find((row) => row.id === id);
        return item ? item.name : null;
      })
      .filter(Boolean);

    setSelectedRows(selectedNames);
  };

  const getCatalogs = async (url: string) => {
    try {
      const { data } = await CatalogService.getAll(url);
      if ("message" in data) {
        setCatalogs([]);
        return;
      }

      const sortedData = data.sort((a, b) => {
        if (a.type === "каталог" && b.type === "файл") return -1;
        if (a.type === "файл" && b.type === "каталог") return 1;
        return a.name.localeCompare(b.name, "ru");
      });

      const formattedData = sortedData.map((item, index) => ({
        id: index + 1,
        name: item.name,
        type: item.type,
      }));

      const images = formattedData
        .filter((item) =>
          IMAGE_EXTENSIONS.includes(
            item.name.split(".").pop()?.toLowerCase() || ""
          )
        )
        .map((item) =>
          `${SERVER_URL}${url}/${item.name}`.replace(/([^:])\/{2,}/g, "$1/")
        );

      setCatalogs(formattedData);
      setImageList(images);
      setImageUrl(null);
      setCurrentIndex(null);
    } catch {
      setCatalogs([]);
      setImageList([]);
      setImageUrl(null);
      setCurrentIndex(null);
    }
  };

  const handleRowClick = (params: any) => {
    let newUrl =
      url === "/static"
        ? `/static/${params.row.name}`
        : `${url}/${params.row.name}`;
    newUrl = newUrl.replace(/([^:])\/{2,}/g, "$1/").replace(/\/$/, "");

    const fileExtension = params.row.name.split(".").pop()?.toLowerCase();
    if (
      params.row.type === "файл" &&
      fileExtension &&
      IMAGE_EXTENSIONS.includes(fileExtension)
    ) {
      const imageUrl = `${SERVER_URL}${newUrl}`.replace(/([^:])\/{2,}/g, "$1/");
      setImageUrl(imageUrl);
      setCurrentIndex(imageList.indexOf(imageUrl));
    } else {
      setUrl(newUrl);
    }
  };

  const handleBackClick = () => {
    setUrl((prevUrl) => {
      const parts = prevUrl.split("/").filter(Boolean);
      if (parts.length <= 1) return "/static";
      parts.pop();
      return `/${parts.join("/")}`.replace(/([^:])\/{2,}/g, "$1/");
    });
    setImageUrl(null);
    setCurrentIndex(null);
  };

  const handleNextImage = () => {
    if (currentIndex !== null && currentIndex < imageList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setImageUrl(imageList[currentIndex + 1]);
    }
  };

  const handlePrevImage = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setImageUrl(imageList[currentIndex - 1]);
    }
  };
  const handleCreateFolder = async () => {
    try {
      const { data } = await CatalogService.getAll(url);
      const existingFolders = data
        .filter((item) => item.type === "каталог")
        .map((item) => item.name);

      let folderName = "Новый каталог";
      let counter = 2;

      while (existingFolders.includes(folderName)) {
        folderName = `Новый каталог ${counter}`;
        counter++;
      }

      const cleanUrl = url.replace(/^\/static/, "") || "";

      await CatalogService.createFolder(`${cleanUrl}/${folderName}`);
      setCatalogs([
        ...catalogs,
        { id: catalogs.length + 1, name: folderName, type: "каталог" },
      ]);
    } catch (error) {
      console.error("Ошибка при создании каталога:", error);
    }
  };

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const cleanUrl = url.replace(/^\/static/, "") || "";

    try {
      await CatalogService.uploadFile(cleanUrl, formData);
      setCatalogs([
        ...catalogs,
        { id: catalogs.length + 1, name: file.name, type: "файл" },
      ]);
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
    }
  };

  const renameItem = async (newName) => {
    const oldName = `${url}/${selectedRows[0]}`.replace(/^\/static/, "") || "";
    const extension = selectedRows[0].includes(".")
      ? selectedRows[0].split(".").pop()
      : "";
    const finalNewName = extension ? `${newName}.${extension}` : newName;
    await CatalogService.renameItem(oldName, finalNewName);
  };

  const handleDelete = async () => {
    if (
      !selectedRows.length &&
      Cookie.get("role") !== import.meta.env.VITE_ROLE_ADMIN
    )
      return;

    const itemsToDelete = selectedRows.map((row) =>
      `${url}/${row}`.replace(/^\/static/, "")
    );

    await CatalogService.deleteItems(itemsToDelete);

    setCatalogs(catalogs.filter((item) => !selectedRows.includes(item.name)));
    setSelectedRows([]);
  };

  useEffect(() => {
    if (!imageUrl) {
      getCatalogs(url);
    }
  }, [url]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!imageUrl) return;

      switch (event.key) {
        case "ArrowLeft":
          handlePrevImage();
          break;
        case "ArrowRight":
          handleNextImage();
          break;
        case "ArrowUp":
          handlePrevImage();
          break;
        case "ArrowDown":
          handleNextImage();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageUrl, currentIndex]);

  return (
    <div>
      {imageUrl ? (
        <Paper
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
          }}
        >
          <img
            src={imageUrl}
            alt="Выбранное изображение"
            style={{
              maxWidth: "100vw",
              maxHeight: "100vh",
              objectFit: "contain",
            }}
          />

          <IconButton
            sx={{
              position: "fixed",
              top: 20,
              left: 20,
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            }}
            onClick={handleBackClick}
          >
            <ArrowBackIcon />
          </IconButton>

          {currentIndex !== null && currentIndex > 0 && (
            <IconButton
              sx={{
                position: "fixed",
                left: 20,
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
              onClick={handlePrevImage}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}

          {currentIndex !== null && currentIndex < imageList.length - 1 && (
            <IconButton
              sx={{
                position: "fixed",
                right: 20,
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
              onClick={handleNextImage}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          )}
        </Paper>
      ) : (
        <Paper sx={{ minHeight: catalogs.length * 52 + 100, width: "100%" }}>
          <DataGrid
            rows={catalogs}
            columns={columns}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{ border: 0 }}
            onRowClick={handleRowClick}
            onRowSelectionModelChange={handleSelectionChange}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          />
        </Paper>
      )}

      <Breadcrumbs
        sx={{ position: "fixed", bottom: 10, left: 50, cursor: "pointer" }}
      >
        <Box
          onClick={() => {
            setUrl("/static");
            setImageUrl(null);
          }}
          color="inherit"
        >
          Главная
        </Box>
        {url
          .split("/")
          .slice(2)
          .map((link, index, arr) => {
            const fullPath = `/static/${arr.slice(0, index + 1).join("/")}`;
            return (
              <Box
                key={fullPath}
                onClick={() => {
                  setUrl(fullPath);
                  setImageUrl(null);
                }}
                color="inherit"
                sx={{ cursor: "pointer" }}
              >
                {link}
              </Box>
            );
          })}
      </Breadcrumbs>
      <IconButton
        sx={{ position: "fixed", bottom: 2, left: 2 }}
        onClick={handleBackClick}
      >
        <ArrowBackIcon />
      </IconButton>
      {!imageUrl && (
        <Box
          sx={{
            position: "fixed",
            bottom: 10,
            right: 10,
            display: "flex",
            gap: 1,
          }}
        >
          {Cookie.get("role") === import.meta.env.VITE_ROLE_ADMIN &&
            selectedRows.length >= 1 && (
              <Button
                variant="outlined"
                onClick={() => setOpenModalDelete(true)}
              >
                Удалить
              </Button>
            )}
          {selectedRows.length === 1 && (
            <Button variant="outlined" onClick={() => setOpenModal(true)}>
              Изменить
            </Button>
          )}
          <Button variant="outlined" onClick={handleCreateFolder}>
            Добавить каталог
          </Button>
          <Button variant="outlined" component="label">
            Загрузить фото
            <input type="file" hidden onChange={handleUploadFile} />
          </Button>
        </Box>
      )}
      <ModalRename
        open={openModal}
        setOpen={setOpenModal}
        update={renameItem}
        getCatalogs={getCatalogs}
        setSelectedRows={setSelectedRows}
      />
      <ModalDelete
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        deleteData={selectedRows}
        deleteItem={handleDelete}
      />
    </div>
  );
};

export default MainPage;
