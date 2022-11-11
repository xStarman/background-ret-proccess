<?php

use App\Models\Ret;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Junges\Kafka\Facades\Kafka;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::get('list', function(Request $request){
    $rets = Ret::get();
    return response()->json($rets);
});
Route::post("upload", function (Request $request) {


    if ($request->hasFile('ret')) {
        $filenamewithextension = $request->file('ret')->getClientOriginalName();


        $filename = pathinfo($filenamewithextension, PATHINFO_FILENAME);

        $extension = $request->file('ret')->getClientOriginalExtension();

        $filenametostore = $filename . '_' . uniqid() . '.' . $extension;

        Storage::disk('ftp')->put($filenametostore, fopen($request->file('ret'), 'r+'));

        $fileObject = new \SplFileObject($request->file('ret'));
        $line = $fileObject->current();

        $ret = Ret::create(["heading" => $line]);

        Kafka::publishOn(env("KAFKA_PROCESS_TOPIC"))
            ->withBodyKey('ret_id', $ret->id)
            ->withBodyKey('file', $filenametostore)->send();

        return response()->json($ret);
    }
});
