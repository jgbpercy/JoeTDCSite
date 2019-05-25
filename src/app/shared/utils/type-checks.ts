import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivationEnd } from '@angular/router';

export function isDefined<T>(suspect: T | undefined): suspect is T {
  return suspect !== undefined;
}

export function isNonNull<T>(suspect: T | null): suspect is T {
  return suspect !== null;
}

export function isDefinedAndNonNull<T>(suspect: T | undefined | null): suspect is T {
  return isDefined(suspect) && isNonNull(suspect);
}

export function assertDefined<T>(
  suspect: T | undefined,
  errMessageOnUndefined?: string,
): suspect is T {
  if (suspect === undefined) {
    throw Error(errMessageOnUndefined || 'Suspect was undefined!');
  }
  return true;
}

export function assertNonNull<T>(suspect: T | null, errMessageOnNull?: string): suspect is T {
  if (suspect === null) {
    throw Error(errMessageOnNull || 'Suspect was null!');
  }
  return true;
}

export function assertDefinedAndNonNull<T>(
  suspect: T | undefined | null,
  errMessageOnUndefined?: string,
  errMessageOnNull?: string,
): suspect is T {
  return assertDefined(suspect, errMessageOnUndefined) && assertNonNull(suspect, errMessageOnNull);
}

export function getDefined<T>(suspect: T | undefined, errMessageOnUndefined?: string): T {
  if (suspect === undefined) {
    throw Error(errMessageOnUndefined || 'Suspect was undefined!');
  }
  return suspect;
}

export function getNonNull<T>(suspect: T | null, errMessageOnNull?: string): T {
  if (suspect === null) {
    throw Error(errMessageOnNull || 'Suspect was null!');
  }
  return suspect;
}

export function getDefinedAndNonNull<T>(
  suspect: T | undefined | null,
  errMessageOnUndefined?: string,
  errMessageOnNull?: string,
): T {
  const definedSuspect = getDefined(suspect, errMessageOnUndefined);
  return getNonNull(definedSuspect, errMessageOnNull);
}

export function opAssertDefined<T>(
  errMessageOnUndefined?: string,
): OperatorFunction<T | undefined, T> {
  return map(x => getDefined(x, errMessageOnUndefined));
}

export function opAssertNonNull<T>(errMessageOnNull?: string): OperatorFunction<T | null, T> {
  return map(x => getNonNull(x, errMessageOnNull));
}

export function opAssertDefinedAndNonNull<T>(
  errMessageOnUndefined?: string,
  errMessageOnNull?: string,
): OperatorFunction<T | undefined | null, T> {
  return map(x => getDefinedAndNonNull(x, errMessageOnUndefined, errMessageOnNull));
}
