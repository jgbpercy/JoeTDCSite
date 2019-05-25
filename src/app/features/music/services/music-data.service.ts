import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { getDefined } from 'app/shared/utils';
import { forkJoin, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Album, DbAlbum, DbTrack, Track } from '../models';

@Injectable()
export class MusicDataService {
  allAlbums: Observable<Album[]>;

  constructor(private afdb: AngularFirestore) {
    this.allAlbums = this.afdb
      .collection<DbAlbum>('albums', albums => albums.orderBy('date', 'desc'))
      .snapshotChanges()
      .pipe(
        switchMap(albumDcas => {
          return forkJoin(
            ...albumDcas.map(albumDca => {
              return this.afdb
                .collection('albums')
                .doc(albumDca.payload.doc.id)
                .collection('tracks', tracks => tracks.orderBy('order'))
                .snapshotChanges()
                .pipe(first());
            }),
          ).pipe(
            map(trackDcasArrays => MusicDataService.mapDCAsToAlbums(albumDcas, trackDcasArrays)),
          );
        }),
      );
  }

  getAlbum(albumId: string): Observable<Album> {
    return forkJoin(
      this.afdb
        .collection('albums')
        .doc<DbAlbum>(albumId)
        .snapshotChanges()
        .pipe(first()),
      this.afdb
        .collection('albums')
        .doc(albumId)
        .collection<DbTrack>('tracks', tracks => tracks.orderBy('order'))
        .snapshotChanges()
        .pipe(first()),
    ).pipe(
      map(stream => {
        const [albumDS, trackDCAs] = stream;
        const dbAlbum = getDefined(albumDS.payload.data());
        return new Album(
          dbAlbum.name,
          dbAlbum.description,
          dbAlbum.artSrc,
          MusicDataService.mapDCAsToTracks(trackDCAs),
          albumId,
        );
      }),
    );
  }

  private static mapDCAsToAlbums(
    albumDcas: DocumentChangeAction<DbAlbum>[],
    trackDcasArray: DocumentChangeAction<DbTrack>[][],
  ): Album[] {
    return albumDcas.map((albumDca, index) => {
      const dbAlbum = albumDca.payload.doc.data();
      return new Album(
        dbAlbum.name,
        dbAlbum.description,
        dbAlbum.artSrc,
        MusicDataService.mapDCAsToTracks(trackDcasArray[index]),
        dbAlbum.downloadUrl,
        albumDca.payload.doc.id,
      );
    });
  }

  private static mapDCAsToTracks(trackDcas: DocumentChangeAction<DbTrack>[]): Track[] {
    return trackDcas.map(trackDca => {
      const dbTrack = trackDca.payload.doc.data();
      return new Track(dbTrack.name, dbTrack.src, dbTrack.downloadUrl, trackDca.payload.doc.id);
    });
  }
}
