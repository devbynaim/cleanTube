import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getPlaylists from "../../api";
import { getStateFromLocal } from "../../utils/localstroge";

const initialState = {
  data: {},
  loading: false,
  error: null,
};

export const addPlaylist = createAsyncThunk(
  "playlists/playlist",
  async (action, { getState }) => {
    if (getState().playlists.data[action.id]) {
      return Promise.reject(new Error("exist"));
    }
    return await getPlaylists(action.id);
  }
);

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    deletePlaylist: (state, { payload }) => {
      delete state.data[payload.id];
    },
    addToFavorite: (state, { payload }) => {
      state.data[payload.id].isFavorite = true;
    },
    removeFromFavorite: (state, { payload }) => {
      state.data[payload.id].isFavorite = false;
    },
    setRunningVideo: (state, { payload }) => {
      state.data[payload.id].running = payload.running;
    },
    cacheGet:((state)=>{
      const localState = JSON.parse(getStateFromLocal("playlist"))
      if(localState){
        state.data = localState.data
      }
    })
  },
  extraReducers: (builder) => {
    builder.addCase(addPlaylist.pending, (state) => {
      state.error = "";
      state.loading = true;
    }),
      builder.addCase(addPlaylist.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data[payload.playlistId] = payload;
      }),
      builder.addCase(addPlaylist.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error;
      });
  },
});

export const { deletePlaylist, addToFavorite, removeFromFavorite,setRunningVideo,cacheGet } =
  playlistSlice.actions;
export default playlistSlice.reducer;
