import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { axiosInstance } from '@/lib/axios';
import { useMusicStore } from '@/store/useMusicStore';
import { Plus, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface NewSong {
  title: string;
  artist: string;
  duration: string;
  albumId?: string;
}

const AddSongDialog = () => {
  const { albums } = useMusicStore();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [song, setSong] = useState<NewSong>({
    title: '',
    artist: '',
    duration: '',
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const audioRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setSong({ title: '', artist: '', duration: '' });
    setAudioFile(null);
    setImageFile(null);
  };

  const handleSubmit = async () => {
    if (!song.title || !song.artist || !song.duration) {
      return toast.error('Please fill in all fields');
    }

    if (!audioFile || !imageFile) {
      return toast.error('Please upload both audio and artwork');
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', song.title);
      formData.append('artist', song.artist);
      formData.append('duration', song.duration);
      formData.append('audioFile', audioFile);
      formData.append('imageFile', imageFile);

      if (song.albumId) {
        formData.append('albumId', song.albumId);
      }

      await axiosInstance.post('/admin/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Song added successfully');
      resetForm();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add song');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
          <Plus className="mr-2 size-4" />
          Add Song
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Add a new song to your music library
          </DialogDescription>
        </DialogHeader>

        {/* hidden inputs */}
        <input
          ref={audioRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
        />
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <div className="space-y-4 py-4">
          {/* artwork */}
          <div
            onClick={() => imageRef.current?.click()}
            className="flex cursor-pointer items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg"
          >
            {imageFile ? (
              <span className="text-sm text-emerald-500">{imageFile.name}</span>
            ) : (
              <div className="text-center text-zinc-400">
                <Upload className="mx-auto mb-2" />
                Upload artwork
              </div>
            )}
          </div>

          {/* audio */}
          <Button variant="outline" onClick={() => audioRef.current?.click()}>
            {audioFile ? audioFile.name : 'Choose audio file'}
          </Button>

          <Input
            placeholder="Title"
            value={song.title}
            onChange={(e) => setSong((s) => ({ ...s, title: e.target.value }))}
            className="bg-zinc-800 border-zinc-700"
          />

          <Input
            placeholder="Artist"
            value={song.artist}
            onChange={(e) => setSong((s) => ({ ...s, artist: e.target.value }))}
            className="bg-zinc-800 border-zinc-700"
          />

          <Input
            type="number"
            min={0}
            placeholder="Duration (seconds)"
            value={song.duration}
            onChange={(e) =>
              setSong((s) => ({ ...s, duration: e.target.value }))
            }
            className="bg-zinc-800 border-zinc-700"
          />

          <Select
            onValueChange={(value) =>
              setSong((s) => ({ ...s, albumId: value }))
            }
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Album (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {albums.map((album) => (
                <SelectItem key={album._id} value={album._id}>
                  {album.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Uploading...' : 'Add Song'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;
