import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { first, map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators/switchMap';

import { Album, DbAlbum, DbTrack, Track } from '../models';

@Injectable()
export class MusicDataService {

    public allAlbums : Observable<Album[]>;

    constructor(
        private afdb : AngularFirestore,
    ) { 
        this.allAlbums = this.afdb.collection<DbAlbum>(
            'albums',
            albums => albums.orderBy('date', 'desc')
        )
        .snapshotChanges()
        .pipe(
            switchMap(albumDcas => {
                return forkJoin(...albumDcas.map(albumDca => {
                    return this.afdb.collection('albums')
                        .doc(albumDca.payload.doc.id)
                        .collection('tracks', tracks => tracks.orderBy('order'))
                        .snapshotChanges()
                        .pipe(first());
                }))
                .pipe(
                    map(trackDcasArrays => MusicDataService.mapDCAsToAlbums(albumDcas, trackDcasArrays))
                );
            }),
        );
    }

    public getAlbum(albumId : string) : Observable<Album> {

        return forkJoin(
            this.afdb.collection('albums')
                .doc(albumId)
                .snapshotChanges()
                .pipe(first()),
            this.afdb.collection('albums')
                .doc(albumId)
                .collection('tracks', tracks => tracks.orderBy('order'))
                .snapshotChanges().pipe(first()),
        )
        .pipe(
            map(albumData => {
                const dbAlbum = albumData[0].payload.data() as DbAlbum;
                return new Album(
                    dbAlbum.name,
                    dbAlbum.description,
                    dbAlbum.artSrc,
                    MusicDataService.mapDCAsToTracks(albumData[1]),
                    albumId,
                );
            })
        );
    }

    private static mapDCAsToAlbums(
        albumDcas : DocumentChangeAction[],
        trackDcasArray : DocumentChangeAction[][]
    ) : Album[] {

        return albumDcas.map((albumDca, index) => {
            const dbAlbum = albumDca.payload.doc.data() as DbAlbum;
            return new Album(
                dbAlbum.name,
                dbAlbum.description,
                dbAlbum.artSrc,
                MusicDataService.mapDCAsToTracks(trackDcasArray[index]),
                albumDca.payload.doc.id,
            );
        });
    }

    private static mapDCAsToTracks(trackDcas : DocumentChangeAction[]) : Track[]  {

        return trackDcas.map(trackDca => {
            const dbTrack = trackDca.payload.doc.data() as DbTrack;
            return new Track(
                dbTrack.name,
                dbTrack.src,
                trackDca.payload.doc.id,
            );
        });
    }
}