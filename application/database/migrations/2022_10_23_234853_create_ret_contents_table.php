<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ret_contents', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('ret_id');
            $table->string('content');
            $table->timestamps();

            $table->foreign('ret_id')
                ->references('id')
                ->on('rets')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ret_contents');
    }
};
